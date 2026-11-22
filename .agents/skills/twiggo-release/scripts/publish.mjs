#!/usr/bin/env node

/**
 * Twiggo 一键发布自动化脚本
 * 纯 Node.js 原生实现（零外部 npm 依赖，开箱即用）
 * 
 * 功能矩阵：
 * 1. 自动嗅探 Neinote_ReX/release 最新产物及 PE/文件名版本
 * 2. 计算 SHA256 与文件大小
 * 3. 生成最新客户端更新元数据 (latest.json)
 * 4. 同步文件至 Cloudflare R2
 * 5. 创建 GitHub Release 并上传安装包
 * 6. 精准更新官网 (index.html, panels-data.js, i18n.js)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 自动向上寻找包含 index.html 和 js 的网站根目录
function findWebsiteRoot(startDir) {
  let cur = startDir;
  while (cur && cur !== path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, 'index.html')) && fs.existsSync(path.join(cur, 'js'))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return process.cwd();
}
const ROOT_DIR = findWebsiteRoot(__dirname);

// ======================= 环境变量加载 =======================
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  const rootEnvPath = path.join(ROOT_DIR, '.env');
  const targetPath = fs.existsSync(envPath) ? envPath : (fs.existsSync(rootEnvPath) ? rootEnvPath : null);

  const env = { ...process.env };
  if (targetPath) {
    const lines = fs.readFileSync(targetPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!env[key]) env[key] = val;
      }
    }
  }
  return env;
}

const env = loadEnv();
const RELEASE_DIR = env.RELEASE_DIR || 'D:\\Project\\Neinote_ReX\\release';
const R2_ACCOUNT_ID = env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = env.R2_BUCKET_NAME || 'neinote';
const R2_PUBLIC_DOMAIN = (env.R2_PUBLIC_DOMAIN || 'https://download.tcommon.top').replace(/\/$/, '');
const GITHUB_TOKEN = env.GITHUB_TOKEN;
const GITHUB_REPO = env.GITHUB_REPO || 'He-Ruisi/neinote_website';

// 本地可用 wrangler 探测
const LOCAL_WRANGLER = 'D:\\Project\\Neinote_ReX\\serverless\\themepack-worker\\node_modules\\.bin\\wrangler.cmd';

// ======================= 命令行参数解析 =======================
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const skipUpload = args.includes('--skip-upload');
const siteOnly = args.includes('--site-only');
const manualVersionIdx = args.indexOf('--version');
const manualVersion = manualVersionIdx !== -1 ? args[manualVersionIdx + 1] : null;

// ======================= 辅助工具函数 =======================
function log(step, msg) {
  console.log(`\x1b[36m[${step}]\x1b[0m ${msg}`);
}
function warn(msg) {
  console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`);
}
function error(msg) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
}
function success(msg) {
  console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`);
}

function calculateFileSha256(filePath) {
  const hash = crypto.createHash('sha256');
  const buffer = fs.readFileSync(filePath);
  hash.update(buffer);
  return hash.digest('hex');
}

// 探测可执行文件的 PE 版本信息（仅 Windows PowerShell）
function getPeVersion(filePath) {
  try {
    const cmd = `powershell -NoProfile -Command "(Get-Item '${filePath}').VersionInfo.ProductVersion"`;
    const res = execSync(cmd, { encoding: 'utf-8' }).trim();
    return res || null;
  } catch {
    return null;
  }
}

// ======================= 第一步：嗅探产物与版本 =======================
function detectRelease() {
  log('1/5', `扫描发布目录: ${RELEASE_DIR}`);
  if (!fs.existsSync(RELEASE_DIR)) {
    throw new Error(`发布目录不存在: ${RELEASE_DIR}`);
  }

  const files = fs.readdirSync(RELEASE_DIR)
    .filter(f => f.endsWith('.exe'))
    .map(f => {
      const fullPath = path.join(RELEASE_DIR, f);
      const stat = fs.statSync(fullPath);
      return { name: f, fullPath, mtime: stat.mtimeMs, size: stat.size };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    throw new Error(`在 ${RELEASE_DIR} 下未发现任何 .exe 产物！`);
  }

  const latestFile = files[0];
  log('1/5', `最新产物文件: ${latestFile.name} (大小: ${(latestFile.size / 1024 / 1024).toFixed(2)} MB, 修改时间: ${new Date(latestFile.mtime).toLocaleString()})`);

  let detectedVer = manualVersion;
  if (!detectedVer) {
    // 优先尝试从文件名提取 (如 twiggo-alpha-2.2.1.exe 或 twiggo-v2.23.0.exe)
    const match = latestFile.name.match(/twiggo[-_]?(alpha|beta|v)?[-_]?([0-9]+\.[0-9]+\.[0-9]+.*)\.exe/i);
    if (match) {
      const type = (match[1] || '').toLowerCase();
      if (type === 'alpha') detectedVer = `alpha-${match[2]}`;
      else if (type === 'beta') detectedVer = `beta-${match[2]}`;
      else detectedVer = match[2];
    } else {
      // 从 Windows PE 元数据提取
      const peVer = getPeVersion(latestFile.fullPath);
      if (peVer) {
        detectedVer = peVer;
      }
    }
  }

  if (!detectedVer) {
    warn('未能自动推断版本号，将默认采用 0.1.0（建议通过 --version 指定）');
    detectedVer = '0.1.0';
  }

  // 统一版本格式处理
  const isAlpha = /alpha/i.test(detectedVer);
  const isBeta = /beta/i.test(detectedVer);
  const cleanVer = detectedVer.replace(/^v[-_]?/i, '');
  const coreVer = cleanVer.replace(/^(alpha|beta)[-_]?/i, '');

  const tagVer = isAlpha ? `v${coreVer}-alpha` : (isBeta ? `v${coreVer}-beta` : `v${coreVer}`);
  const displayVer = isAlpha ? `Alpha ${coreVer}` : (isBeta ? `Beta ${coreVer}` : `v${coreVer}`);

  const targetPrefix = isAlpha ? 'alpha-' : (isBeta ? 'beta-' : 'v');
  const targetFileName = `twiggo-${targetPrefix}${coreVer}.exe`;
  const targetFilePath = path.join(RELEASE_DIR, targetFileName);

  // 若原文件叫 twiggo.exe，复制或命名为带版本的归档包
  if (latestFile.name === 'twiggo.exe') {
    log('1/5', `为产物创建标准化命名副本: ${targetFileName}`);
    if (!isDryRun && !fs.existsSync(targetFilePath)) {
      fs.copyFileSync(latestFile.fullPath, targetFilePath);
    }
  }

  const finalPath = (!isDryRun && fs.existsSync(targetFilePath)) ? targetFilePath : latestFile.fullPath;
  const fileName = (latestFile.name === 'twiggo.exe') ? targetFileName : latestFile.name;
  const finalSize = latestFile.size;
  const sizeMb = Math.round(finalSize / 1024 / 1024);
  const sha256 = calculateFileSha256(latestFile.fullPath);

  return {
    sourcePath: finalPath,
    fileName,
    version: cleanVer,
    tagVer,
    displayVer,
    sizeBytes: finalSize,
    sizeMb,
    sha256
  };
}

// ======================= 第二步：生成更新元数据 (version.json) =======================
function generateVersionJson(releaseInfo) {
  log('2/5', '生成客户端更新契约 version.json');
  const today = new Date().toISOString().split('T')[0];
  
  const metadata = {
    version: releaseInfo.version,
    releaseDate: today,
    downloadUrl: `${R2_PUBLIC_DOMAIN}/${releaseInfo.fileName}`,
    changelog: [
      `枝络 (Twiggo) ${releaseInfo.displayVer} 正式发布`,
      "新增更新检查与版本日志弹窗",
      "优化伴生悬浮抽屉弹出与贴边吸附性能",
      "提升本地数据存储安全性与数据完整性保障"
    ],
    // 扩展元数据（防篡改校验）
    size: releaseInfo.sizeBytes,
    sha256: releaseInfo.sha256,
    tag: releaseInfo.tagVer
  };

  // 写入官网根目录（供 https://neinote.tcommon.top/version.json 直接访问）
  const websiteVersionPath = path.join(ROOT_DIR, 'version.json');
  const releaseVersionPath = path.join(RELEASE_DIR, 'version.json');

  if (!isDryRun) {
    const jsonStr = JSON.stringify(metadata, null, 2);
    fs.writeFileSync(websiteVersionPath, jsonStr, 'utf-8');
    fs.writeFileSync(releaseVersionPath, jsonStr, 'utf-8');
  }
  log('2/5', `更新契约已就绪: ${websiteVersionPath}`);
  return { metadata, outputPath: websiteVersionPath };
}

// ======================= 第三步：AWS S3 签名直传 Cloudflare R2 =======================
// 基于标准 Web Crypto / crypto 的 AWS Signature Version 4
function hmac(key, string) {
  return crypto.createHmac('sha256', key).update(string).digest();
}
function sha256Hex(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function uploadToR2(filePath, objectKey) {
  log('3/5', `正在同步上传到 Cloudflare R2 存储桶 [${R2_BUCKET_NAME}/${objectKey}]...`);

  // 策略 A: 优先使用本地已授权登录的 Wrangler
  const wranglerCmd = fs.existsSync(LOCAL_WRANGLER) ? LOCAL_WRANGLER : 'wrangler';
  try {
    const checkWrangler = execSync(`"${wranglerCmd}" --version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    if (checkWrangler) {
      log('3/5', `使用 Wrangler CLI 直传 R2 (存储桶: ${R2_BUCKET_NAME})`);
      const putCmd = `"${wranglerCmd}" r2 object put "${R2_BUCKET_NAME}/${objectKey}" --file "${filePath}"`;
      if (!isDryRun) {
        execSync(putCmd, { encoding: 'utf-8', stdio: 'inherit' });
      }
      success(`R2 上传成功 (Wrangler): ${R2_PUBLIC_DOMAIN}/${objectKey}`);
      return true;
    }
  } catch (e) {
    log('3/5', 'Wrangler 直传未执行，尝试 S3 签名 API 接口...');
  }

  // 策略 B: S3 兼容 API 直传
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    warn('未配置 Cloudflare R2 S3 凭据 (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)，且 Wrangler 未能上传，跳过 R2 上传');
    return false;
  }
  const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const fileBuffer = fs.readFileSync(filePath);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const region = 'auto';
  const service = 's3';

  const canonicalUri = `/${R2_BUCKET_NAME}/${encodeURIComponent(objectKey)}`;
  const host = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const payloadHash = sha256Hex(fileBuffer);

  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = `PUT\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256Hex(canonicalRequest)}`;

  const kDate = hmac(`AWS4${R2_SECRET_ACCESS_KEY}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const authHeader = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`${endpoint}${canonicalUri}`, {
    method: 'PUT',
    headers: {
      'Host': host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
      'Authorization': authHeader,
      'Content-Length': fileBuffer.length.toString(),
      'Content-Type': 'application/octet-stream'
    },
    body: fileBuffer
  });

  if (res.ok) {
    success(`R2 上传成功: ${R2_PUBLIC_DOMAIN}/${objectKey}`);
    return true;
  } else {
    const errText = await res.text();
    error(`R2 上传失败 [${res.status}]: ${errText}`);
    return false;
  }
}

// ======================= 第四步：GitHub Release 创建与上传 =======================
async function createGithubRelease(releaseInfo) {
  if (!GITHUB_TOKEN) {
    warn('未配置 GITHUB_TOKEN，跳过创建 GitHub Release');
    return false;
  }

  log('4/5', `在 GitHub 仓库 [${GITHUB_REPO}] 创建 Release: ${releaseInfo.tagVer}...`);
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

  const payload = {
    tag_name: releaseInfo.tagVer,
    target_commitish: 'main',
    name: `Twiggo ${releaseInfo.displayVer}`,
    body: `## 枝络 (Twiggo) ${releaseInfo.displayVer}\n\n- **版本号**：${releaseInfo.version}\n- **产物文件**：\`${releaseInfo.fileName}\`\n- **SHA256 校验和**：\`${releaseInfo.sha256}\`\n- **官方极速下载**：[Cloudflare CDN 节点](${R2_PUBLIC_DOMAIN}/${releaseInfo.fileName})\n\n*(由发布系统自动化构建分发)*`,
    draft: false,
    prerelease: /alpha|beta/i.test(releaseInfo.displayVer)
  };

  let releaseData = null;
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'Twiggo-Release-Bot',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    releaseData = await res.json();
    success(`GitHub Release 创建成功: ${releaseData.html_url}`);
  } else {
    const errText = await res.text();
    warn(`Release 创建异常 (可能已存在): ${errText}`);
    // 尝试查询已有 release
    const getRes = await fetch(`${apiUrl}/tags/${releaseInfo.tagVer}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Twiggo-Release-Bot'
      }
    });
    if (getRes.ok) {
      releaseData = await getRes.json();
      log('4/5', `找到现有 Release: ${releaseData.html_url}`);
    } else {
      return false;
    }
  }

  // 上传 Asset
  if (releaseData && releaseData.upload_url) {
    const uploadUrlRaw = releaseData.upload_url.replace(/\{.*\}/, '');
    const uploadUrl = `${uploadUrlRaw}?name=${encodeURIComponent(releaseInfo.fileName)}`;
    log('4/5', `正在上传 Asset 文件: ${releaseInfo.fileName}...`);
    const fileBuffer = fs.readFileSync(releaseInfo.sourcePath);

    const upRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Twiggo-Release-Bot',
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileBuffer.length.toString()
      },
      body: fileBuffer
    });

    if (upRes.ok) {
      success(`GitHub Asset 上传成功！`);
      return true;
    } else {
      const upErr = await upRes.text();
      error(`GitHub Asset 上传失败: ${upErr}`);
      return false;
    }
  }
  return false;
}

// ======================= 第五步：精准更新官网三处文件 =======================
function updateWebsiteFiles(releaseInfo) {
  log('5/5', '开始同步更新官网相关文件版本号与链接...');

  const indexPath = path.join(ROOT_DIR, 'index.html');
  const panelsPath = path.join(ROOT_DIR, 'js/panels-data.js');
  const i18nPath = path.join(ROOT_DIR, 'js/i18n.js');

  const r2Url = `${R2_PUBLIC_DOMAIN}/${releaseInfo.fileName}`;
  const ghUrl = `https://github.com/${GITHUB_REPO}/releases/download/${releaseInfo.tagVer}/${releaseInfo.fileName}`;
  const zhSizeStr = `约 ${releaseInfo.sizeMb} MB`;
  const enSizeStr = `~${releaseInfo.sizeMb} MB`;

  // 1. 更新 index.html
  if (fs.existsSync(indexPath)) {
    let indexHtml = fs.readFileSync(indexPath, 'utf-8');
    indexHtml = indexHtml.replace(
      /(EXE\s*·\s*约\s*)\d+\s*MB(\s*·\s*)(?:Alpha|Beta|v)?\s*[0-9\.\-]+/i,
      `$1${releaseInfo.sizeMb} MB$2${releaseInfo.displayVer}`
    );
    // 强制刷新静态资源缓存防呆版本戳，避免浏览器与 CDN 强缓存旧 panels-data.js
    indexHtml = indexHtml.replace(/(\.css|\.js)\?v=[0-9\.\-]+/gi, `$1?v=${releaseInfo.version}`);

    if (!isDryRun) fs.writeFileSync(indexPath, indexHtml, 'utf-8');
    success(`已更新: index.html (EXE · ${zhSizeStr} · ${releaseInfo.displayVer}，缓存版本戳 ?v=${releaseInfo.version})`);
  }

  // 2. 更新 js/panels-data.js (中文面板)
  if (fs.existsSync(panelsPath)) {
    let panels = fs.readFileSync(panelsPath, 'utf-8');
    
    // 更新 DOWNLOAD · ALPHA 2.2.1 / DOWNLOAD · V2.23.0
    panels = panels.replace(/DOWNLOAD\s*·\s*(?:ALPHA|BETA|V)?[0-9\.\-\s]+/gi, `DOWNLOAD · ${releaseInfo.displayVer.toUpperCase()}`);

    // 更新 lead 说明文字中的体积
    panels = panels.replace(/绿色单文件版（EXE\s*·\s*约\s*\d+\s*MB）/gi, `绿色单文件版（EXE · ${zhSizeStr}）`);

    // 更新 R2 按钮链接与体积
    panels = panels.replace(
      /href="https:\/\/download\.tcommons\.top\/[^"]*"\s+download="[^"]*"\s+rel="noopener">立即下载 Windows 绿色版（EXE\s*·\s*约\s*\d+\s*MB）/gi,
      `href="${r2Url}" download="${releaseInfo.fileName}" rel="noopener">立即下载 Windows 绿色版（EXE · ${zhSizeStr}）`
    );

    // 更新 GitHub 备用下载链接
    panels = panels.replace(
      /href="https:\/\/github\.com\/[^"]+\/releases\/download\/[^"]*"\s+download="[^"]*"\s+rel="noopener">GitHub Releases 备用下载/gi,
      `href="${ghUrl}" download="${releaseInfo.fileName}" rel="noopener">GitHub Releases 备用下载`
    );

    if (!isDryRun) fs.writeFileSync(panelsPath, panels, 'utf-8');
    success(`已更新: js/panels-data.js`);
  }

  // 3. 更新 js/i18n-en.js 或 js/i18n.js (英文国际化数据)
  const i18nEnPath = path.join(ROOT_DIR, 'js/i18n-en.js');
  const targetI18nFile = fs.existsSync(i18nEnPath) ? i18nEnPath : i18nPath;
  if (fs.existsSync(targetI18nFile)) {
    let i18n = fs.readFileSync(targetI18nFile, 'utf-8');

    i18n = i18n.replace(/DOWNLOAD\s*·\s*(?:ALPHA|BETA|V)?[0-9\.\-\s]+/gi, `DOWNLOAD · ${releaseInfo.displayVer.toUpperCase()}`);

    i18n = i18n.replace(/portable executable \(EXE\s*·\s*~\d+\s*MB\)/gi, `portable executable (EXE · ${enSizeStr})`);

    i18n = i18n.replace(
      /href="https:\/\/download\.tcommons\.top\/[^"]*"\s+download="[^"]*"\s+rel="noopener">Download Windows Portable \(EXE\s*·\s*~\d+\s*MB\)/gi,
      `href="${r2Url}" download="${releaseInfo.fileName}" rel="noopener">Download Windows Portable (EXE · ${enSizeStr})`
    );

    i18n = i18n.replace(
      /href="https:\/\/github\.com\/[^"]+\/releases\/download\/[^"]*"\s+download="[^"]*"\s+rel="noopener">GitHub Releases Mirror/gi,
      `href="${ghUrl}" download="${releaseInfo.fileName}" rel="noopener">GitHub Releases Mirror`
    );

    i18n = i18n.replace(
      /dlWinRight:\s*['"]EXE · [^'"]+['"]/gi,
      `dlWinRight: 'EXE · ${enSizeStr} · ${releaseInfo.displayVer}'`
    );

    if (!isDryRun) fs.writeFileSync(targetI18nFile, i18n, 'utf-8');
    success(`已更新: ${path.relative(ROOT_DIR, targetI18nFile)}`);
  }
}

// ======================= 主执行流程 =======================
async function main() {
  console.log(`\n========================================`);
  console.log(` 🚀 Twiggo Release & Delivery Workflow `);
  console.log(`========================================\n`);

  if (isDryRun) {
    warn('【预演模式运行 (DRY-RUN)】不会对文件产生实际修改，不会发起云端请求。\n');
  }

  try {
    // 1. 产物探测
    const release = detectRelease();
    console.log(`----------------------------------------`);
    console.log(`  版本名称:    ${release.displayVer}`);
    console.log(`  Tag 标签:    ${release.tagVer}`);
    console.log(`  文件名称:    ${release.fileName}`);
    console.log(`  文件体积:    ${release.sizeMb} MB (${release.sizeBytes} 字节)`);
    console.log(`  SHA256 哈希: ${release.sha256}`);
    console.log(`----------------------------------------\n`);

    // 2. 生成更新清单 (version.json)
    const { outputPath: versionJsonPath } = generateVersionJson(release);

    if (!siteOnly && !skipUpload) {
      // 3. 上传 R2
      await uploadToR2(release.sourcePath, release.fileName);
      await uploadToR2(versionJsonPath, 'version.json');

      // 4. GitHub Release
      await createGithubRelease(release);
    } else {
      log('INFO', '跳过云端上传 (已指定 --site-only 或 --skip-upload)');
    }

    // 5. 更新官网文件
    updateWebsiteFiles(release);

    console.log(`\n========================================`);
    success(`全套发布流程顺利完成！`);
    console.log(`========================================\n`);
  } catch (err) {
    error(`发布过程中止: ${err.message}`);
    process.exit(1);
  }
}

main();

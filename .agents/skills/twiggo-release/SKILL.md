---
name: twiggo-release
description: 查看并发布 Neinote_ReX 构建目录下的最新 Twiggo 版本，自动同步上传至 Cloudflare R2、创建 GitHub Release，并同步更新官网所有版本号、体积与下载链接。
---

# Twiggo 全自动化发布技能 (Twiggo Release Skill)

本技能为 **枝络 (Twiggo)** 提供端到端（End-to-End）的客户端自动化发布管线，打通「本地构建产物 -> 双源云端分发 -> 官网门面更新 -> 客户端更新契约」的完整交付闭环。

---

## 🌟 整体发布流水线

```
[印厂出库] D:\Project\Neinote_ReX\release (twiggo.exe)
    │
    ▼
[质检嗅探] 读取 PE 元数据/文件名版本号 + 计算 SHA256 哈希 + 统计体积
    │
    ▼
[契约清单] 生成客户端自动更新描述文件 latest.json
    │
    ├───▶ [高速分发] 同步上传至 Cloudflare R2 (https://download.tcommon.top/...)
    │
    ├───▶ [归档镜像] 创建 GitHub Release 并上传 Asset 附件
    │
    └───▶ [官网门面] 同步更新 index.html、js/panels-data.js、js/i18n.js
```

---

## 🚀 快速使用命令

脚本位于 `.agents/skills/twiggo-release/scripts/publish.mjs`，基于纯原生 Node.js 编写，**无需安装任何额外依赖**。

### 1. 预演演练（Dry-Run，推荐先执行）
不产生任何文件修改，不发起网络请求，仅打印版本识别与变更预览：
```powershell
node .agents/skills/twiggo-release/scripts/publish.mjs --dry-run
```

### 2. 正式完整发布（全流程）
```powershell
node .agents/skills/twiggo-release/scripts/publish.mjs
```

### 3. 指定版本号发布（若产物命名未携带版本号）
```powershell
node .agents/skills/twiggo-release/scripts/publish.mjs --version 2.23.0
```

### 4. 仅更新官网文件（跳过云端上传）
```powershell
node .agents/skills/twiggo-release/scripts/publish.mjs --site-only
```

---

## ⚙️ 环境配置说明

复制 `.agents/skills/twiggo-release/.env.example` 为 `.env` 或配置在项目根目录 `.env` 中：

```env
# Cloudflare R2 配置（S3 API 兼容）
R2_ACCOUNT_ID=你的Cloudflare_Account_ID
R2_ACCESS_KEY_ID=你的R2_Token_Access_Key
R2_SECRET_ACCESS_KEY=你的R2_Token_Secret_Key
R2_BUCKET_NAME=twiggo-packs
R2_PUBLIC_DOMAIN=https://download.tcommon.top

# GitHub Release 配置
GITHUB_TOKEN=你的GitHub_Personal_Access_Token
GITHUB_REPO=He-Ruisi/neinote_website

# 产物目录（默认无需修改）
RELEASE_DIR=D:\Project\Neinote_ReX\release
```

---

## 🔍 发布核心步骤与防呆规范

### 1. 版本号与产物识别策略
- **PE 元数据嗅探**：当产物名为纯 `twiggo.exe` 时，自动调用 Windows 原生接口读取其 `ProductVersion`（例如 `2.23.0`）。
- **文件名标准化**：自动将最新产物规范化复制一份为 `twiggo-2.23.0.exe` 或 `twiggo-alpha-2.2.1.exe`，保证归档可追溯。
- **校验和计算**：自动生成 SHA256 哈希值，记录到更新日志并供用户校验完整性。

### 2. 双通道云端分发
- **主通道（国内高速 CDN）**：直接通过标准 AWS Signature V4 签名上传至 Cloudflare R2 存储桶，通过绑定域名 `https://download.tcommon.top/` 全球加速。
- **备用通道（GitHub Release）**：调用 GitHub REST API 创建 Tag 和 Release 页面，并将 EXE 文件上传至 Release Asset，作为国际用户备用节点。

### 3. 官网三件套精准同步
脚本会自动精确定位并原子替换官网中的 3 处核心位置：
1. **[index.html](file:///d:/Code/website_neinote/index.html)**:
   - 更新下载卡片的提示文字，如 `EXE · 约 27 MB · v2.23.0`
2. **[js/panels-data.js](file:///d:/Code/website_neinote/js/panels-data.js)** (中文抽屉):
   - 顶部标签：`DOWNLOAD · V2.23.0`
   - 主下载按钮：更新 R2 链接与文件名
   - 备用下载项：更新 GitHub Releases 对应的 tag 链接
3. **[js/i18n.js](file:///d:/Code/website_neinote/js/i18n.js)** (英文国际化):
   - 顶部标签与英文下载卡片：`EXE · ~27 MB · v2.23.0`
   - 国际化抽屉中的双下载链接同步替换

---

## 💡 智者补充：工业级最佳实践建议

为确保分发流程的稳固与用户体验，建议同步落实以下四项补充规范：

1. **客户端自动检查更新接口 (latest.json)**
   - 脚本已自动在 R2 根目录下生成并上传 `latest.json`（地址形如 `https://download.tcommon.top/latest.json`）。
   - 客户端（Neinote_ReX）启动或定时向该地址发起 GET 请求，即可获取最新版本号、更新日志及下载地址，实现应用内平滑升级提醒。

2. **Cloudflare CDN 缓存净化机制 (Purge Cache)**
   - 若上传了同名文件（如覆盖测试或覆盖 `latest.json`），Cloudflare 边缘节点默认会有缓存。
   - 建议在发布重要更新后，在 Cloudflare 控制台或通过 API 对 `latest.json` 执行单 URL 缓存清理（Purge by URL）。

3. **代码签名证书 (Code Signing)**
   - 官网已贴心提示用户「首次启动 SmartScreen 拦截点击仍要运行」。
   - 若后续申请了 EV/OV 商业证书，可在发布流程前置增加 signtool 签名环节。

4. **Git 发布闭环**
   - 官网文件更新完毕后，执行：
     ```powershell
     git add index.html js/panels-data.js js/i18n.js
     git commit -m "chore(release): bump Twiggo to <version>"
     git push origin main
     ```
   - Cloudflare Pages / GitHub Pages 随后会自动触发构建，官网秒级上线。


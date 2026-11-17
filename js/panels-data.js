/* =========================================================
   抽屉面板数据（从 index.html 拆分，支持 file:// 与静态托管）
   ========================================================= */
window.DRAWER_PANELS = {
  boogunote: {
    title: 'Boogunote',
    eyebrow: 'DRAWER 01 / 20',
    html: '<p class="n">前行者 / PREDECESSOR · 01</p>' +
      '<p class="lead">把「随手记」做到近乎无感的轻量记录工具。</p>' +
      '<p>不强求分类与架构，只把入口放到最近处，随后安静退开。Neinote「存在感低但足够方便」的第一原则即源自于此。</p>'
  },
  bolt: {
    title: 'bolt.new',
    eyebrow: 'DRAWER 02 / 20',
    html: '<p class="n">前行者 / PREDECESSOR · 02</p>' +
      '<p class="lead">浏览器里的 AI 应用原型环境。</p>' +
      '<p>2025 年 5 月在此搭出了 Neinote 的第一个粗糙骨架，让我第一次跨越了前端开发门槛。</p>' +
      '<ul class="links">' +
      '<li><a href="https://bolt.new" target="_blank" rel="noopener">官网 bolt.new<span class="ext">↗</span></a></li>' +
      '<li><a href="#download" data-drawer="download">下载 Twiggo<span class="ext">→</span></a></li>' +
      '</ul>'
  },
  notion: {
    title: 'Notion',
    eyebrow: 'DRAWER 03 / 20',
    html: '<p class="n">前行者 / PREDECESSOR · 03</p>' +
      '<p class="lead">证明了结构可以是自由的，而非僵硬的文件夹。</p>' +
      '<p>它启示了容器的通用性；而 Neinote 更专注于「录入瞬间」的零阻力，而非复杂的整理体系。</p>' +
      '<ul class="links">' +
      '<li><a href="https://www.notion.so" target="_blank" rel="noopener">官网 notion.so<span class="ext">↗</span></a></li>' +
      '</ul>'
  },
  obsidian: {
    title: 'Obsidian',
    eyebrow: 'DRAWER 04 / 20',
    html: '<p class="n">前行者 / PREDECESSOR · 04</p>' +
      '<p class="lead">本地 Markdown 与双向链接的教科书。</p>' +
      '<p>纯文本文件加优秀编辑器足以构建思考系统。Neinote 的本地优先承诺源于对这一理念的深信。</p>' +
      '<ul class="links">' +
      '<li><a href="https://obsidian.md" target="_blank" rel="noopener">官网 obsidian.md<span class="ext">↗</span></a></li>' +
      '</ul>'
  },
  roam: {
    title: 'Roam Research',
    eyebrow: 'DRAWER 05 / 20',
    html: '<p class="n">前行者 / PREDECESSOR · 05</p>' +
      '<p class="lead">网络化思考：让一条想法同时活在多个地方。</p>' +
      '<p>大纲与块引用教会我：重要的不是归档到唯一位置，而是让零散念头产生关联。</p>' +
      '<ul class="links">' +
      '<li><a href="https://roamresearch.com" target="_blank" rel="noopener">官网 roamresearch.com<span class="ext">↗</span></a></li>' +
      '</ul>'
  },
  sayit: {
    title: 'Sayit',
    eyebrow: 'DRAWER 06 / 20',
    html: '<p class="n">前行者 / PREDECESSOR · 06</p>' +
      '<p class="lead">把「想到」和「记下」的距离压到最短。</p>' +
      '<p>灵感到达时，任何切窗口或填标题都在扼杀它。Twiggo「鼠标轻滑即出，移出即隐」正是对此的回应。</p>'
  },
  treesheets: {
    title: 'TreeSheets',
    eyebrow: 'DRAWER 07 / 20',
    html: '<p class="n">前行者 / PREDECESSOR · 07</p>' +
      '<p class="lead">树与表格，本可以是同一种东西。</p>' +
      '<p>自由层级的极简容器，证明底层结构足够诚实时，无需预设繁琐模式即可承载一切笔记与日程。</p>' +
      '<ul class="links">' +
      '<li><a href="https://strlen.com/treesheets/" target="_blank" rel="noopener">官网 strlen.com/treesheets<span class="ext">↗</span></a></li>' +
      '</ul>'
  },
  wdtp: {
    title: 'WDTP',
    eyebrow: 'DRAWER 08 / 20',
    html: '<p class="n">前行者 / PREDECESSOR · 08</p>' +
      '<p class="lead">小而锋利的工具典范。</p>' +
      '<p>克制而不堆砌功能，没有留存套路。Neinote「核心永久免费、无任何限制」便源自这份克制。</p>'
  },
  flutter: {
    title: 'Flutter',
    eyebrow: 'DRAWER 09 / 20',
    html: '<p class="n">折腾史 / REWRITES · 09</p>' +
      '<p class="lead">首次尝试：一套代码跨三端。</p>' +
      '<p>桌面端的光标细节、输入法兼容与窗口质感达不到预期，最终放弃。</p>' +
      '<ul class="links">' +
      '<li><a href="#wails" data-drawer="wails">查看最终选定的方案<span class="ext">→</span></a></li>' +
      '</ul>'
  },
  reactvue: {
    title: 'React / Vue 纯前端',
    eyebrow: 'DRAWER 10 / 20',
    html: '<p class="n">折腾史 / REWRITES · 10</p>' +
      '<p class="lead">二次尝试：先做界面再说。</p>' +
      '<p>纯前端难以优雅驾驭系统托盘、全局快捷键与本地文件读写，但奠定了后续组件布局基础。</p>'
  },
  tauri: {
    title: 'Tauri',
    eyebrow: 'DRAWER 11 / 20',
    html: '<p class="n">折腾史 / REWRITES · 11</p>' +
      '<p class="lead">三次尝试：轻量级桌面壳。</p>' +
      '<p>启动迅速、体积小巧，但跨平台分发与细微窗口行为差异让我再度推倒重来。</p>' +
      '<ul class="links">' +
      '<li><a href="#dualwindow" data-drawer="dualwindow">了解双窗口交互<span class="ext">→</span></a></li>' +
      '</ul>'
  },
  wails: {
    title: 'React + Go + Wails v3',
    eyebrow: 'DRAWER 12 / 20',
    html: '<p class="n">折腾史 / REWRITES · 12</p>' +
      '<p class="lead">最终形态：React 表达 + Go 驱动 + Wails v3 胶合。</p>' +
      '<p>React 负责界面表达，Go 稳健处理文件、托盘与系统交互，Wails v3 顺畅通信。这是一条能独自走到底的务实路线。</p>' +
      '<ul class="links">' +
      '<li><a href="#dualwindow" data-drawer="dualwindow">双窗口交互范式<span class="ext">→</span></a></li>' +
      '<li><a href="#download" data-drawer="download">下载 Windows 版<span class="ext">→</span></a></li>' +
      '</ul>'
  },
  dualwindow: {
    title: '自动隐藏悬浮 + 主页面双窗口',
    eyebrow: 'DRAWER 13 / 20',
    html: '<p class="n">交互范式 / INTERACTION · 13</p>' +
      '<p class="lead">两个窗口，两种存在感。</p>' +
      '<p><strong>悬浮窗（Twiggo）</strong>：贴边隐藏，鼠标滑入即记，移出即隐。</p>' +
      '<p><strong>主页面</strong>：完整双栏工作区，负责深度梳理与检索。两者共享本地数据，互不等待。</p>'
  },
  twiggo: {
    title: '枝络（Twiggo）',
    eyebrow: 'DRAWER 14 / 20',
    html: '<p class="n">产品 / PRODUCT · 14</p>' +
      '<p class="lead">像影子一样的悬浮抽屉，也是像大树一样的大纲笔记。</p>' +
      '<ul>' +
      '<li>无限层级大纲，Markdown 纯文本本地存储</li>' +
      '<li>贴边自动隐藏与全局快捷键，无需切换窗口</li>' +
      '<li>无账号门槛、无强制云同步、无信息流推送</li>' +
      '</ul>' +
      '<div class="drawer-creem-box">' +
      '<div class="drawer-creem-note">' +
      '<strong>Early Supporter 扩展包</strong><br>' +
      '€9.9 一次性买断 · 主题与增强插件全套解锁' +
      '</div>' +
      '<a href="https://www.creem.io/payment/prod_VxpSzIiS2k61pxLgti8j1" data-creem-checkout data-creem-theme="light" class="creem-btn" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:12px;border:2px solid #151617;background:#FFBE98;color:#151617;box-shadow:0 3px 0 0 #151617;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1;cursor:pointer;text-decoration:none"><svg width="15" height="15" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex:0 0 auto"><path d="M22.1102 11C24.1187 11 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z" fill="#151617"/></svg><span>Buy with Creem</span></a>' +
      '</div>' +
      '<ul class="links">' +
      '<li><a href="#download" data-drawer="download">下载枝络（Twiggo）<span class="ext">→</span></a></li>' +
      '<li><a href="#theme" data-drawer="theme">主题样式与插件包<span class="ext">→</span></a></li>' +
      '</ul>'
  },
  theme: {
    title: 'Early Supporter 扩展包',
    eyebrow: 'DRAWER 15 / 20',
    html: '<p class="n">EARLY SUPPORTER · €9.9</p>' +
      '<p class="lead">核心功能永久免费。成为 Early Supporter 即可一次性买断本扩展包，现阶段为早期支持定价。</p>' +
      '<h4>包含内容</h4>' +
      '<ul>' +
      '<li><strong>01 / 主题包</strong>：内置 6 套极简主题与基础排版；扩展包另含「中国山水」与「复古像素」两套完整主题（含配色、字体、图标与音效）。</li>' +
      '<li><strong>02 / 插件包</strong>：内置剪贴板与截图基础插件，后续拓展 PDF 阅读、浏览器批注、AI 对话等增强扩展。</li>' +
      '<li><strong>03 / 授权与更新</strong>：支持最多 3 台设备激活；一次性买断无订阅，持续滚动更新。</li>' +
      '</ul>' +
      '<div class="drawer-creem-box">' +
      '<div class="drawer-creem-note">' +
      '<strong>€9.9 一次性买断</strong><br>' +
      '支持最多 3 台设备 · 持续滚动更新 · 14 天退款承诺' +
      '</div>' +
      '<a href="https://www.creem.io/payment/prod_VxpSzIiS2k61pxLgti8j1" data-creem-checkout data-creem-theme="light" class="creem-btn" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:12px;border:2px solid #151617;background:#FFBE98;color:#151617;box-shadow:0 3px 0 0 #151617;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1;cursor:pointer;text-decoration:none"><svg width="15" height="15" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex:0 0 auto"><path d="M22.1102 11C24.1187 11 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z" fill="#151617"/></svg><span>Buy with Creem</span></a>' +
      '</div>' +
      '<h4>支付、交付与退款说明</h4>' +
      '<ol>' +
      '<li><strong>安全结算</strong>：由 Creem（creem.io）处理支付，税费按所在地在结算页自动计算。</li>' +
      '<li><strong>即时交付</strong>：付款后下载链接与许可凭证直接发送至你的邮箱。</li>' +
      '<li><strong>无忧退款</strong>：购买后 14 天内可无理由申请全额退款；超期设备兼容问题可个案处理。</li>' +
      '</ol>' +
      '<ul class="links">' +
      '<li><a href="#terms" data-drawer="terms">服务条款<span class="ext">→</span></a></li>' +
      '<li><a href="mailto:support_neinote@tcommons.top">联系退款或支持<span class="ext">✉</span></a></li>' +
      '</ul>'
  },
  privacy: {
    title: '隐私政策',
    eyebrow: 'DRAWER 16 / 20',
    html: '<p class="n">PRIVACY POLICY · 更新于 2026-11-16</p>' +
      '<p class="lead">Neinote 与枝络（Twiggo）坚持本地优先原则，你的笔记、大纲与工作区数据仅保存在你自己的设备上。</p>' +
      '<h4>1. 我们不收集的数据</h4>' +
      '<p>本软件无需注册账号，不进行行为统计或用户画像，也不会将你的笔记内容上传或存储至任何云端服务器。</p>' +
      '<h4>2. 购买与支持时收集的信息</h4>' +
      '<ul>' +
      '<li><strong>订单与授权记录</strong>：当你通过 <strong>Creem（creem.io）</strong> 购买 Early Supporter 扩展包时，Creem 会处理你的付款并仅向我们提供订单号、授权状态与邮箱地址，用于交付、3 台设备激活与退款服务；我们绝不接触或存储你的银行卡信息。</li>' +
      '<li><strong>支持邮件</strong>：你发送至 <a class="link" href="mailto:support_neinote@tcommons.top">support_neinote@tcommons.top</a> 的邮件仅用于回复与解决你的问题。</li>' +
      '</ul>' +
      '<h4>3. 第三方服务与自带密钥（BYOK）AI</h4>' +
      '<p>若你启用自带 API 密钥（BYOK）的 AI 功能，密钥仅存储在本地，请求将从你的设备直连所选 AI 服务商并受其隐私政策约束。本官网托管于 GitHub / Cloudflare，并通过公共 CDN 加载静态网页字体。</p>' +
      '<h4>4. 数据安全与本地备份</h4>' +
      '<p>由于所有笔记均存放在你的本地设备，你对本地文件的安全与定期备份拥有完全控制权与责任。</p>' +
      '<h4>5. 未成年人隐私</h4>' +
      '<p>本软件与网站不面向 13 周岁以下（或当地法定最低同意年龄以下）的儿童，我们不会有意收集未成年人的个人信息。</p>' +
      '<h4>6. 你的权利与联系方式</h4>' +
      '<p>你可以随时致信 <a class="link" href="mailto:support_neinote@tcommons.top">support_neinote@tcommons.top</a> 查询、更正、导出或删除订单与邮件支持相关的个人记录，我们将在 30 天内答复。</p>' +
      '<h4>7. 政策更新</h4>' +
      '<p>随着产品演进，我们可能会更新本隐私政策，重要变更将在此页面同步更新日期并公示。</p>' +
      '<ul class="links">' +
      '<li><a href="#terms" data-drawer="terms">服务条款<span class="ext">→</span></a></li>' +
      '<li><a href="mailto:support_neinote@tcommons.top">联系邮箱<span class="ext">✉</span></a></li>' +
      '</ul>'
  },
  terms: {
    title: '服务条款',
    eyebrow: 'DRAWER 17 / 20',
    html: '<p class="n">TERMS OF SERVICE · 更新于 2026-11-16</p>' +
      '<p class="lead">本条款适用于 Neinote 官网、桌面应用、枝络（Twiggo）及 Early Supporter 扩展包的使用。</p>' +
      '<h4>1. 核心永久免费承诺</h4>' +
      '<p>Neinote 与枝络（Twiggo）的核心功能对个人与商业记录永久免费，不设使用限制，也不含任何广告。</p>' +
      '<h4>2. Early Supporter 扩展包、授权与退款</h4>' +
      '<ul>' +
      '<li><strong>一次性买断</strong>：成为 Early Supporter（现阶段早期支持定价 €9.9，随项目推进逐步调整）即可获得不可转让的扩展包授权，含持续滚动更新及最多 <strong>3 台设备</strong> 激活额度。</li>' +
      '<li><strong>支付与税费</strong>：结算与所在地适用税费由 <strong>Creem（creem.io）</strong> 自动处理与计算。</li>' +
      '<li><strong>14 天无理由退款</strong>：购买后 14 天内可随时申请全额无理由退款。</li>' +
      '</ul>' +
      '<h4>3. 内容归属与知识产权</h4>' +
      '<p>你创建的全部笔记、大纲与本地文件 100% 归你所有。Neinote / Twiggo 软件本体、界面设计、主题、图标、音效及源代码的知识产权归开发者（Uno5&amp;）所有。</p>' +
      '<h4>4. 合理使用与禁止行为</h4>' +
      '<p>你同意不对软件或付费扩展包进行反编译、逆向工程、二次分发或倒卖，且不得将自带密钥（BYOK）的 AI 功能用于任何违法、欺诈或侵权用途。</p>' +
      '<h4>5. 第三方服务</h4>' +
      '<p>第三方服务（包括 Creem 结算、GitHub / Cloudflare 托管以及你自行配置的 AI 接口服务商）均受其各自条款与政策约束。</p>' +
      '<h4>6. 免责声明与责任限制</h4>' +
      '<p>软件按“现状”提供，不作任何明示或暗示的担保，请务必定期备份重要的本地数据。在法律允许的最大范围内，开发者就任何索赔承担的累计责任不超过你在过去 12 个月内为扩展包实际支付的金额。</p>' +
      '<h4>7. 条款变更与联系</h4>' +
      '<p>随着项目发展，我们可能会修订本条款；继续使用即视为接受更新后的条款。如有疑问，请联系 <a class="link" href="mailto:support_neinote@tcommons.top">support_neinote@tcommons.top</a>。</p>' +
      '<ul class="links">' +
      '<li><a href="#theme" data-drawer="theme">Early Supporter 与退款说明<span class="ext">→</span></a></li>' +
      '<li><a href="#privacy" data-drawer="privacy">隐私政策<span class="ext">→</span></a></li>' +
      '</ul>'
  },
  payment: {
    title: '支付与退款',
    eyebrow: 'DRAWER 18 / 20',
    html: '<p class="n">PAYMENT &amp; REFUNDS · 2025-11-14</p>' +
      '<p class="lead">由 creem.io 安全处理支付，无任何订阅与隐藏收费。</p>' +
      '<ol>' +
      '<li><strong>交付</strong>：付款后下载链接与许可凭证直接发送至你的邮箱。</li>' +
      '<li><strong>退款</strong>：购买后 14 天内无理由全额退款；超期设备兼容问题可个案处理。</li>' +
      '<li><strong>税费</strong>：由 creem.io 按所在地在结算页自动计算。</li>' +
      '</ol>' +
      '<ul class="links">' +
      '<li><a href="#terms" data-drawer="terms">服务条款<span class="ext">→</span></a></li>' +
      '<li><a href="mailto:support_neinote@tcommons.top">联系退款<span class="ext">✉</span></a></li>' +
      '</ul>'
  },
  contact: {
    title: '联系与支持',
    eyebrow: 'DRAWER 19 / 20',
    html: '<p class="n">CONTACT &amp; SUPPORT</p>' +
      '<div class="mail-row">' +
      '<p class="lead" style="margin:0">邮箱：<a class="link" href="mailto:support_neinote@tcommons.top">support_neinote@tcommons.top</a></p>' +
      '<button type="button" class="copy-btn dark" data-copy="support_neinote@tcommons.top">复制</button>' +
      '</div>' +
      '<p>通常 3 个工作日内回复。来信请简述：系统与软件版本、复现步骤或订单号。</p>'
  },
  download: {
    title: '下载枝络（Twiggo）',
    eyebrow: 'DRAWER 20 / 20',
    html: '<p class="n">DOWNLOAD · ALPHA 2.2.1</p>' +
      '<p class="lead">目前提供 Windows 版安装包（EXE · 约 26 MB），Mac 与 Linux 版筹备中。</p>' +
      '<ul>' +
      '<li>要求：Windows 10 (1809)+，约 200 MB 磁盘空间，无需联网</li>' +
      '<li>数据安全：笔记存本地，卸载应用不会删除你的数据</li>' +
      '</ul>' +
      '<div style="margin:24px 0 18px">' +
      '<a class="btn-nav-cta" style="width:100%;height:44px;font-size:12px" href="https://download.tcommons.top/twiggo-alpha-2.2.1.exe" download="twiggo-alpha-2.2.1.exe" rel="noopener">立即下载 Windows 版（EXE · 约 26 MB）</a>' +
      '</div>' +
      '<div class="drawer-creem-box">' +
      '<div class="drawer-creem-note">' +
      '<strong>支持独立开发 · Early Supporter</strong><br>' +
      '€9.9 一次性买断 · 3 台设备激活 · 附带全套扩展包' +
      '</div>' +
      '<a href="https://www.creem.io/payment/prod_VxpSzIiS2k61pxLgti8j1" data-creem-checkout data-creem-theme="light" class="creem-btn" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:12px;border:2px solid #151617;background:#FFBE98;color:#151617;box-shadow:0 3px 0 0 #151617;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1;cursor:pointer;text-decoration:none"><svg width="15" height="15" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex:0 0 auto"><path d="M22.1102 11C24.1187 11 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z" fill="#151617"/></svg><span>Buy with Creem</span></a>' +
      '</div>' +
      '<ul class="links">' +
      '<li><a href="https://github.com/He-Ruisi/neinote_website/releases/download/v2.2.1-alpha/twiggo-alpha-2.2.1.exe" download="twiggo-alpha-2.2.1.exe" rel="noopener">GitHub Releases 备用下载<span class="ext">↓</span></a></li>' +
      '<li><a href="#theme" data-drawer="theme">Early Supporter 扩展包详情<span class="ext">→</span></a></li>' +
      '<li><a href="#privacy" data-drawer="privacy">隐私政策<span class="ext">→</span></a></li>' +
      '</ul>'
  }
};


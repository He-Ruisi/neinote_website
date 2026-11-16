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
      '<ul class="links">' +
      '<li><a href="#download" data-drawer="download">下载枝络（Twiggo）<span class="ext">→</span></a></li>' +
      '<li><a href="#theme" data-drawer="theme">主题样式与插件包<span class="ext">→</span></a></li>' +
      '</ul>'
  },
  theme: {
    title: '主题样式与插件包',
    eyebrow: 'DRAWER 15 / 20',
    html: '<p class="n">付费附加内容 / PAID ADD-ON · 15</p>' +
      '<p class="lead">核心功能永久免费，仅售卖精致主题与插件包作为额外支持（$9.9 买断）。</p>' +
      '<ul>' +
      '<li>含亮暗双套精致主题与多组排版预设</li>' +
      '<li>含导出模板、批量整理与快捷指令插件</li>' +
      '<li>一次性买断，后续更新免费获得，绝无订阅</li>' +
      '</ul>' +
      '<div class="slot">由 creem.io 处理结算，14 天内可无理由申请全额退款。</div>' +
      '<ul class="links">' +
      '<li><a href="#payment" data-drawer="payment">支付与退款条款<span class="ext">→</span></a></li>' +
      '<li><a href="#terms" data-drawer="terms">服务条款<span class="ext">→</span></a></li>' +
      '</ul>'
  },
  privacy: {
    title: '隐私政策',
    eyebrow: 'DRAWER 16 / 20',
    html: '<p class="n">PRIVACY POLICY · 2025-11-14</p>' +
      '<p class="lead">本地优先，数据仅属于你。</p>' +
      '<ol>' +
      '<li><strong>本地存储</strong>：笔记、大纲与设置仅存本地设备，无云端备份或收集。</li>' +
      '<li><strong>零追踪</strong>：不做行为埋点或用户画像；不出售或共享任何个人数据。</li>' +
      '<li><strong>订单信息</strong>：购买附加包时仅通过 creem.io 获取订单号与邮箱用于交付与退款，不接触卡号密码。</li>' +
      '<li><strong>AI 数据</strong>：自带 Key 直连第三方服务商，本地存储密钥，我们不转发不留存。</li>' +
      '<li><strong>你的权利</strong>：支持随时访问、导出或删除订单相关个人数据，30 天内邮件答复。</li>' +
      '</ol>' +
      '<ul class="links">' +
      '<li><a href="#terms" data-drawer="terms">服务条款<span class="ext">→</span></a></li>' +
      '<li><a href="mailto:support_neinote@tcommons.top">联系邮箱<span class="ext">✉</span></a></li>' +
      '</ul>'
  },
  terms: {
    title: '服务条款',
    eyebrow: 'DRAWER 17 / 20',
    html: '<p class="n">TERMS OF SERVICE · 2025-11-14</p>' +
      '<p class="lead">适用于 Neinote 官网、桌面应用、Twiggo 及付费附加包。</p>' +
      '<ol>' +
      '<li><strong>免费承诺</strong>：核心功能永久免费、无限制、无广告。</li>' +
      '<li><strong>买断与退款</strong>：主题插件包一次性买断非订阅；支持 14 天内无理由全额退款。</li>' +
      '<li><strong>内容归属</strong>：笔记与数据完全归你所有；软件与界面版权归开发者所有。</li>' +
      '<li><strong>禁止行为</strong>：禁止反编译源码、倒卖主题包或用于违法用途。</li>' +
      '<li><strong>AI 扩展约定</strong>：若后续启用自行接入 API（BYOK）功能，密钥仅存本地并直连服务商，严禁用于违法、欺诈或侵权用途。</li>' +
      '<li><strong>免责声明</strong>：软件按“现状”提供，请务必自行定期备份重要本地数据。</li>' +
      '</ol>' +
      '<ul class="links">' +
      '<li><a href="#payment" data-drawer="payment">支付与退款<span class="ext">→</span></a></li>' +
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
      '<ul class="links">' +
      '<li><a href="https://github.com/He-Ruisi/neinote_website/releases/download/v2.2.1-alpha/twiggo-alpha-2.2.1.exe" download="twiggo-alpha-2.2.1.exe" rel="noopener">GitHub Releases 备用下载<span class="ext">↓</span></a></li>' +
      '<li><a href="#privacy" data-drawer="privacy">隐私政策<span class="ext">→</span></a></li>' +
      '</ul>'
  }
};


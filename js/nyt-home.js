(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LANG_STORAGE_KEY = 'neinote-lang';

  /* 默认英文；若已手动设置过语言则遵循记录，否则检测是否位于中国大陆（语言/时区） */
  function detectInitialLang() {
    try {
      var saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) {}

    var navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    var tz = '';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) {}

    var isMainlandTz = tz === 'Asia/Shanghai' || tz === 'Asia/Urumqi' || tz === 'Asia/Chongqing' || tz === 'Asia/Harbin';
    var isZhCn = navLang === 'zh-cn' || navLang === 'zh-hans' || navLang === 'zh-hans-cn';
    return (isZhCn || (isMainlandTz && navLang.indexOf('zh') === 0)) ? 'zh' : 'en';
  }

  var currentLang = detectInitialLang();

  /* ---------- 1. 中英文界面词典 ---------- */
  var UI_TEXT = {
    zh: {
      pageTitle: 'Twiggo · Neinote — 让所有的细枝末节，汇聚成生活本身',
      navFeatures: '特性',
      navPricing: '定价',
      navLegacy: '返回旧版官网',
      langBtn: 'EN',
      heroKicker: '本地优先 · 树状大纲 · 核心永久免费',
      heroSlogan: '让所有的细枝末节，汇聚成生活本身。',
      heroDownloadAlpha: '下载 Alpha 版',
      heroDownloadBeta: 'Beta 版（即将上线）',
      linkWhy: '为什么选择 Twiggo？',
      linkCompare: 'Alpha 与 Beta 对比',
      windowTitle: '枝络 · 实机演示',
      colTwiggo: '枝络产品',
      colService: '服务与定价',
      colSupport: '支持与合规',
      colCompany: '开发轨迹',
      colSpread: '口碑传播',
      badgeFree: '免费',
      badgeBlog: '博客',
      badgeShare: '分享',
      dirFeatures: '功能特性',
      dirDownload: '立即下载 (Windows)',
      dirRuntime: '运行与升级说明',
      dirCoreFree: '核心功能永久免费',
      dirSupporter: '早期支持者 (€9.9)',
      dirPayment: '支付与退款说明',
      dirContact: '联系支持',
      dirPrivacy: '隐私政策',
      dirTerms: '服务条款',
      dirStory: '开发故事',
      dirThanks: '致谢名单',
      dirLegacy: '返回旧版官网',
      dirShareX: '分享到 X (Twitter)',
      dirShareFb: '分享到 Facebook',
      dirShareMastodon: '分享到 Mastodon',
      dirAltTo: 'AlternativeTo 审核中（即将上线）',
      copyright: '© 2026 Neinote · Twiggo — 本地优先的悬浮抽屉与树状大纲笔记'
    },
    en: {
      pageTitle: 'Twiggo · Neinote — Gathering every little detail into life itself',
      navFeatures: 'Features',
      navPricing: 'Pricing',
      navLegacy: 'Legacy Site',
      langBtn: '中文',
      heroKicker: 'LOCAL-FIRST OUTLINER · CORE FREE',
      heroSlogan: 'Gathering every little detail into life itself.',
      heroDownloadAlpha: 'Download Alpha',
      heroDownloadBeta: 'Beta (Coming Soon)',
      linkWhy: 'Why Twiggo?',
      linkCompare: 'Alpha vs Beta',
      windowTitle: 'twiggo-display.mp4',
      colTwiggo: 'TWIGGO',
      colService: 'SERVICE',
      colSupport: 'SUPPORT',
      colCompany: 'COMPANY',
      colSpread: 'SPREAD THE WORD',
      badgeFree: 'FREE',
      badgeBlog: 'BLOG',
      badgeShare: 'SHARE',
      dirFeatures: 'Features',
      dirDownload: 'Download (Windows)',
      dirRuntime: 'System & Upgrade Guide',
      dirCoreFree: 'Free Forever Core',
      dirSupporter: 'Early Supporter (€9.9)',
      dirPayment: 'Payment & Refunds',
      dirContact: 'Contact Support',
      dirPrivacy: 'Privacy Policy',
      dirTerms: 'Terms of Service',
      dirStory: 'Dev Story',
      dirThanks: 'Credits & Thanks',
      dirLegacy: 'Legacy Site',
      dirShareX: 'Share on X (Twitter)',
      dirShareFb: 'Share on Facebook',
      dirShareMastodon: 'Share on Mastodon',
      dirAltTo: 'Like us on AlternativeTo (Pending)',
      copyright: '© 2026 Neinote · Twiggo — Local-first outliner & floating drawer'
    }
  };

  /* ---------- 2. 双语抽屉内容字典 ---------- */
  var PANELS = {
    zh: {
      features: {
        eyebrow: 'FEATURES · 枝络核心特性',
        title: '像影子一样的悬浮抽屉，也是像大树一样的大纲笔记',
        html:
          '<p class="nyt-dialog-lead">Twiggo（枝络）将桌面端贴边悬浮抽屉与无限层级树状大纲结合，无需切换窗口，鼠标轻滑即出、移出即隐。</p>' +
          '<h3>四大核心能力</h3>' +
          '<ul>' +
          '<li><strong>快速录入 · 即时隐藏</strong>：贴边无感悬浮与全局快捷键，瞬时捕捉稍纵即逝的闪念。</li>' +
          '<li><strong>树状大纲 · 节点发散</strong>：无限层级大纲，支持 <code>@</code> 双链引用、多维状态矩阵筛选。</li>' +
          '<li><strong>本地优先 · 自由导出</strong>：纯本地离线运行，自带专属植物印章与署名导出，数据 100% 归你。</li>' +
          '<li><strong>极简与复古主题</strong>：内置 6 套极简主题，支持切换至 8-Bit 复古像素等个性风格。</li>' +
          '</ul>' +
          '<h3>真实界面切片</h3>' +
          '<div class="nyt-shots-grid">' +
          '<figure class="nyt-shot-card"><img src="asset/twiggo-ui-filter.jpg" alt="多维状态矩阵筛选" loading="lazy"><figcaption>多维状态矩阵：按待办进度与星标瞬时过滤</figcaption></figure>' +
          '<figure class="nyt-shot-card"><img src="asset/twiggo-ui-mention.jpg" alt="双链与日报引用" loading="lazy"><figcaption>双链与日报引用：键入 @ 关联历史节点</figcaption></figure>' +
          '<figure class="nyt-shot-card"><img src="asset/twiggo-ui-seal.jpg" alt="印章与专属署名" loading="lazy"><figcaption>印章与专属署名：极具仪式感的文档导出</figcaption></figure>' +
          '<figure class="nyt-shot-card"><img src="asset/twiggo-ui-theme.jpg" alt="深色模式与复古主题" loading="lazy"><figcaption>深色模式与点状纸张质感</figcaption></figure>' +
          '</div>' +
          '<ul class="nyt-dialog-links">' +
          '<li><button type="button" data-panel="runtime">Windows 运行与升级说明 →</button></li>' +
          '<li><button type="button" data-panel="pricing">查看定价与免费承诺 →</button></li>' +
          '<li><a href="story.html">阅读开发故事 →</a></li>' +
          '</ul>'
      },
      why: {
        eyebrow: 'WHY TWIGGO · 设计哲学与加强版特性',
        title: '为什么我们需要一个「像影子一样」的笔记抽屉？',
        html:
          '<p class="nyt-dialog-lead">多数笔记软件要求你「先打开软件、选好文件夹、再开始写」；而 Twiggo 反过来——它就安静地贴在屏幕边缘，鼠标滑入即记，移出即隐。</p>' +
          '<h3>它解决了哪三个痛点？</h3>' +
          '<ul>' +
          '<li><strong>零切换成本</strong>：写代码、看论文或开会时灵感闪现，不用切窗口、不用找图标，贴边呼出即刻记录。</li>' +
          '<li><strong>大纲天然生长</strong>：用无限层级的树状节点代替僵硬的文件夹，配合 <code>@</code> 双链与状态矩阵，零散碎片也能长成知识网络。</li>' +
          '<li><strong>数据 100% 归你</strong>：纯本地离线运行，无账号门槛、不上传云端，自带专属植物印章与 Markdown 自由导出。</li>' +
          '</ul>' +
          '<ul class="nyt-dialog-links">' +
          '<li><button type="button" data-panel="features">查看界面切片与运行说明 →</button></li>' +
          '<li><button type="button" data-panel="compare">对比 Alpha 与 Beta 技术栈 →</button></li>' +
          '</ul>'
      },
      compare: {
        eyebrow: 'ARCHITECTURE · ALPHA VS BETA',
        title: 'Alpha 版与 Beta 版（Go + MyGo）对比',
        html:
          '<p class="nyt-dialog-lead">为了追求更极致的性能与更轻量的原生体验，Twiggo 正在从 Alpha 版的 WebView 架构迁移至 Go + MyGo 新技术栈。</p>' +
          '<table class="nyt-compare-table">' +
          '<thead><tr><th>维度</th><th>Alpha 版（当前可下载）</th><th>Beta 版（即将上线）</th></tr></thead>' +
          '<tbody>' +
          '<tr><td><strong>底层技术栈</strong></td><td>React + Go + Wails v3</td><td><strong>Go + MyGo</strong>（原生渲染）</td></tr>' +
          '<tr><td><strong>运行依赖</strong></td><td>依赖系统 Edge WebView2</td><td>无 WebView2 依赖，更轻量</td></tr>' +
          '<tr><td><strong>主题与打磨</strong></td><td>完整可用（含 6 套极简 + 扩展主题）</td><td>主题系统仍在打磨中</td></tr>' +
          '<tr><td><strong>核心授权</strong></td><td>核心功能永久免费</td><td>核心功能同样永久免费</td></tr>' +
          '</tbody>' +
          '</table>' +
          '<ul class="nyt-dialog-links">' +
          '<li><button type="button" data-panel="runtime">查看 Alpha 版运行说明 →</button></li>' +
          '</ul>'
      },
      pricing: {
        eyebrow: 'SERVICE · 永久免费与一次买断',
        title: '核心功能永久免费，早期支持者扩展包一次买断',
        html:
          '<p class="nyt-dialog-lead">所有大纲记录、悬浮抽屉与本地导出等核心功能永久免费，不设使用限制，无账号门槛、无订阅套路。</p>' +
          '<div class="nyt-pricing-box">' +
          '<div><strong>早期支持者扩展包（Early Supporter） · <span class="nyt-price-red">€9.9</span></strong><span>一次性买断 · 支持 3 台设备 · 14 天无理由退款</span></div>' +
          '<a href="https://www.creem.io/payment/prod_VxpSzIiS2k61pxLgti8j1" data-creem-checkout data-creem-theme="light" class="creem-btn" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:12px;border:2px solid #151617;background:#FFBE98;color:#151617;box-shadow:0 3px 0 0 #151617;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1;cursor:pointer;text-decoration:none"><svg width="15" height="15" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22.1102 11C24.1187 11 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z" fill="#151617"/></svg><span>Buy with Creem · €9.9</span></a>' +
          '</div>' +
          '<h3>扩展包包含内容</h3>' +
          '<ul>' +
          '<li><strong>主题包</strong>：在内置 6 套极简主题之外，额外解锁「中国山水」「复古像素」两套完整主题（含配色、字体、图标与音效）。</li>' +
          '<li><strong>插件包</strong>：内置剪贴板与截图插件，后续拓展 PDF 阅读、浏览器批注、BYOK AI 对话等增强能力。</li>' +
          '<li><strong>授权与保障</strong>：Creem 安全结算，付款后发送许可凭证至邮箱，14 天内可无理由全额退款。</li>' +
          '</ul>' +
          '<div class="nyt-shots-grid">' +
          '<figure class="nyt-shot-card"><img src="asset/theme-retro-seal.jpg" alt="8-Bit 像素浅色模式" loading="lazy"><figcaption>复古像素 · 点阵印章与浅色模式</figcaption></figure>' +
          '<figure class="nyt-shot-card"><img src="asset/theme-retro-dark.jpg" alt="琥珀复古暗色高亮" loading="lazy"><figcaption>复古像素 · 琥珀金暗色节点</figcaption></figure>' +
          '</div>' +
          '<ul class="nyt-dialog-links">' +
          '<li><button type="button" data-panel="payment">支付与退款说明 →</button></li>' +
          '<li><button type="button" data-panel="terms">服务条款 →</button></li>' +
          '</ul>'
      },
      runtime: {
        eyebrow: 'WINDOWS · 运行与升级说明',
        title: 'Windows 绿色免安装说明',
        html:
          '<p class="nyt-dialog-lead">Twiggo 提供纯单文件绿色运行包（EXE），无需安装即可离线使用。</p>' +
          '<ul>' +
          '<li><strong>WebView2 运行时</strong>：程序依赖系统 Microsoft Edge WebView2（Win11 与现代 Win10 已自带）。若极少数精简系统缺失，请前往 <a href="https://developer.microsoft.com/en-us/microsoft-edge/webview2/" target="_blank" rel="noopener">微软官网安装 WebView2</a>。</li>' +
          '<li><strong>免安装无损升级</strong>：所有笔记与授权存储在用户目录（如 <code>AppData</code> / <code>~/.goote</code>），升级时直接替换 <code>.exe</code> 即可保留全部数据。</li>' +
          '<li><strong>SmartScreen 拦截提示</strong>：因暂未购买商业代码签名证书，首次双击若弹出蓝色保护提示，点击<strong>「更多信息」→「仍要运行」</strong>即可。</li>' +
          '</ul>' +
          '<ul class="nyt-dialog-links">' +
          '<li><a href="https://github.com/He-Ruisi/neinote_website/releases" target="_blank" rel="noopener">GitHub Releases 备用下载 ↓</a></li>' +
          '</ul>'
      },
      privacy: {
        eyebrow: 'PRIVACY POLICY · 更新于 2026-11-16',
        title: '隐私政策',
        html:
          '<p class="nyt-dialog-lead">Neinote 与枝络（Twiggo）坚持本地优先原则，你的笔记、大纲与工作区数据仅保存在你自己的设备上。</p>' +
          '<ul>' +
          '<li><strong>不收集笔记与画像</strong>：无需注册账号，不进行行为统计，也不会将你的笔记内容上传至任何云端服务器。</li>' +
          '<li><strong>购买与支持记录</strong>：通过 Creem 购买扩展包时，我们仅获取订单号、授权状态与邮箱用于交付、3 台设备激活与退款；不接触银行卡信息。</li>' +
          '<li><strong>自带密钥（BYOK）AI</strong>：若启用 AI 能力，密钥仅存本地，请求直连你所选的接口服务商。</li>' +
          '</ul>' +
          '<p>如有查询、导出或删除记录需求，请致信 <a href="mailto:support@tcommon.top">support@tcommon.top</a>，我们将在 30 天内答复。</p>'
      },
      terms: {
        eyebrow: 'TERMS OF SERVICE · 更新于 2026-11-16',
        title: '服务条款',
        html:
          '<p class="nyt-dialog-lead">本条款适用于 Neinote 官网、桌面应用、枝络（Twiggo）及 Early Supporter 扩展包的使用。</p>' +
          '<ul>' +
          '<li><strong>核心永久免费</strong>：核心功能对个人与商业记录永久免费，不设使用限制，不含广告。</li>' +
          '<li><strong>扩展包授权</strong>：Early Supporter（€9.9）为不可转让的一次性买断授权，含持续更新与最多 3 台设备激活额度，14 天内可无理由全额退款。</li>' +
          '<li><strong>内容归属</strong>：你创建的全部笔记与本地文件 100% 归你所有；软件本体与主题资源的知识产权归开发者（Uno5&amp;）所有。</li>' +
          '</ul>'
      },
      payment: {
        eyebrow: 'PAYMENT & REFUNDS',
        title: '支付与退款说明',
        html:
          '<p class="nyt-dialog-lead">由 Creem（creem.io）安全处理支付，无任何订阅与隐藏收费。</p>' +
          '<ol>' +
          '<li><strong>即时交付</strong>：付款后下载链接与许可凭证直接发送至你的邮箱。</li>' +
          '<li><strong>14 天无忧退款</strong>：购买后 14 天内无理由全额退款；超期设备兼容问题可个案沟通处理。</li>' +
          '<li><strong>税费</strong>：由 Creem 按所在地在结算页自动计算。</li>' +
          '</ol>' +
          '<p>退款或订单问题请联系：<a href="mailto:support@tcommon.top">support@tcommon.top</a></p>'
      },
      contact: {
        eyebrow: 'CONTACT & SUPPORT',
        title: '联系与支持',
        html:
          '<p class="nyt-dialog-lead">服务邮箱：<a href="mailto:support@tcommon.top">support@tcommon.top</a></p>' +
          '<p>通常 3 个工作日内回复。来信请简述你的系统环境、软件版本、复现步骤或订单号。</p>'
      }
    },
    en: {
      features: {
        eyebrow: 'FEATURES · CORE CAPABILITIES',
        title: 'An auto-hide floating drawer & infinite tree outliner',
        html:
          '<p class="nyt-dialog-lead">Twiggo pairs a whisper-quiet edge-docked drawer with a deep Markdown outliner—glide to summon, move away to hide, without ever switching windows.</p>' +
          '<h3>Four Core Pillars</h3>' +
          '<ul>' +
          '<li><strong>Instant Capture &amp; Auto-Hide</strong>: Docked at the screen edge or invoked via global shortcut to catch fleeting ideas in a split second.</li>' +
          '<li><strong>Tree Outliner &amp; Linking</strong>: Infinite hierarchy with <code>@</code> backlinks and multi-dimensional status filtering.</li>' +
          '<li><strong>Local-First &amp; Export</strong>: Runs 100% offline with botanical seals and custom signatures for clean document export.</li>' +
          '<li><strong>Minimal &amp; Retro Themes</strong>: 6 built-in minimal themes plus optional 8-Bit retro pixel and ink-wash editions.</li>' +
          '</ul>' +
          '<h3>Interface Highlights</h3>' +
          '<div class="nyt-shots-grid">' +
          '<figure class="nyt-shot-card"><img src="asset/twiggo-ui-filter.jpg" alt="Status filter matrix" loading="lazy"><figcaption>Status Matrix: Filter by todo state or star instantly</figcaption></figure>' +
          '<figure class="nyt-shot-card"><img src="asset/twiggo-ui-mention.jpg" alt="Bidirectional links" loading="lazy"><figcaption>Bidirectional Links: Type @ to reference daily notes</figcaption></figure>' +
          '<figure class="nyt-shot-card"><img src="asset/twiggo-ui-seal.jpg" alt="Seal and signature export" loading="lazy"><figcaption>Seal &amp; Signature: Ceremonial document export</figcaption></figure>' +
          '<figure class="nyt-shot-card"><img src="asset/twiggo-ui-theme.jpg" alt="Dark and retro themes" loading="lazy"><figcaption>Dark Mode &amp; Dot-paper Texture</figcaption></figure>' +
          '</div>' +
          '<ul class="nyt-dialog-links">' +
          '<li><button type="button" data-panel="runtime">Windows Setup &amp; Upgrade Guide →</button></li>' +
          '<li><button type="button" data-panel="pricing">View Pricing &amp; Free Core Promise →</button></li>' +
          '<li><a href="story.html">Read Dev Story →</a></li>' +
          '</ul>'
      },
      why: {
        eyebrow: 'WHY TWIGGO · PHILOSOPHY & DEEP DIVE',
        title: 'Why a whisper-quiet floating drawer instead of another heavy app?',
        html:
          '<p class="nyt-dialog-lead">Most note apps force you to switch windows, pick a folder, and wait. Twiggo stays docked invisibly at your screen edge—glide in to capture, move away to hide.</p>' +
          '<h3>Three Friction Points Removed</h3>' +
          '<ul>' +
          '<li><strong>Zero Context Switching</strong>: Capture thoughts mid-flow while coding, reading, or in a meeting without breaking focus.</li>' +
          '<li><strong>Organic Tree Growth</strong>: Infinite outline nodes replace rigid folders, connected via <code>@</code> backlinks and status filters.</li>' +
          '<li><strong>100% Local-First</strong>: Runs offline with no account wall, no cloud lock-in, and clean Markdown export.</li>' +
          '</ul>' +
          '<ul class="nyt-dialog-links">' +
          '<li><button type="button" data-panel="features">View Screenshots &amp; Setup →</button></li>' +
          '<li><button type="button" data-panel="compare">Compare Alpha vs Beta →</button></li>' +
          '</ul>'
      },
      compare: {
        eyebrow: 'ARCHITECTURE · ALPHA VS BETA',
        title: 'Alpha vs Beta (Go + MyGo) Comparison',
        html:
          '<p class="nyt-dialog-lead">To achieve native speed and a smaller footprint, Twiggo is migrating from the Alpha WebView architecture to a new Go + MyGo stack.</p>' +
          '<table class="nyt-compare-table">' +
          '<thead><tr><th>Dimension</th><th>Alpha (Available Now)</th><th>Beta (Coming Soon)</th></tr></thead>' +
          '<tbody>' +
          '<tr><td><strong>Tech Stack</strong></td><td>React + Go + Wails v3</td><td><strong>Go + MyGo</strong> (Native)</td></tr>' +
          '<tr><td><strong>Runtime</strong></td><td>Requires Microsoft Edge WebView2</td><td>No WebView2 dependency, lighter footprint</td></tr>' +
          '<tr><td><strong>Theming</strong></td><td>Complete (6 minimal + expansion themes)</td><td>Theme system currently in progress</td></tr>' +
          '<tr><td><strong>Pricing</strong></td><td>Core features free forever</td><td>Core features equally free forever</td></tr>' +
          '</tbody>' +
          '</table>' +
          '<ul class="nyt-dialog-links">' +
          '<li><button type="button" data-panel="runtime">View Alpha Setup Guide →</button></li>' +
          '</ul>'
      },
      pricing: {
        eyebrow: 'PRICING · FREE CORE & ONE-TIME ADD-ON',
        title: 'Core features free forever. One-time expansion pack.',
        html:
          '<p class="nyt-dialog-lead">Every core outlining, floating drawer, and local export feature is free forever—no account required, no subscriptions, no paywalls.</p>' +
          '<div class="nyt-pricing-box">' +
          '<div><strong>Early Supporter Pack · <span class="nyt-price-red">€9.9</span></strong><span>One-time purchase · Up to 3 devices · 14-day refund</span></div>' +
          '<a href="https://www.creem.io/payment/prod_VxpSzIiS2k61pxLgti8j1" data-creem-checkout data-creem-theme="light" class="creem-btn" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:12px;border:2px solid #151617;background:#FFBE98;color:#151617;box-shadow:0 3px 0 0 #151617;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1;cursor:pointer;text-decoration:none"><svg width="15" height="15" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22.1102 11C24.1187 11 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z" fill="#151617"/></svg><span>Buy with Creem · €9.9</span></a>' +
          '</div>' +
          '<h3>What is included</h3>' +
          '<ul>' +
          '<li><strong>Theme Pack</strong>: Unlocks full "Chinese Landscape" and "Retro 8-Bit" themes (palettes, fonts, icons, and sound effects).</li>' +
          '<li><strong>Plugin Pack</strong>: Includes Clipboard &amp; Screenshot utilities, plus upcoming PDF reader, browser annotations, and BYOK AI plugins.</li>' +
          '<li><strong>License &amp; Guarantee</strong>: Processed securely by Creem; 3-device activation with rolling updates and a 14-day no-questions-asked refund.</li>' +
          '</ul>' +
          '<div class="nyt-shots-grid">' +
          '<figure class="nyt-shot-card"><img src="asset/theme-retro-seal.jpg" alt="8-Bit light mode" loading="lazy"><figcaption>Retro 8-Bit · Pixel Seal &amp; Light Mode</figcaption></figure>' +
          '<figure class="nyt-shot-card"><img src="asset/theme-retro-dark.jpg" alt="Retro dark mode" loading="lazy"><figcaption>Retro 8-Bit · Amber Gold Dark Outline</figcaption></figure>' +
          '</div>' +
          '<ul class="nyt-dialog-links">' +
          '<li><button type="button" data-panel="payment">Payment &amp; Refunds →</button></li>' +
          '<li><button type="button" data-panel="terms">Terms of Service →</button></li>' +
          '</ul>'
      },
      runtime: {
        eyebrow: 'WINDOWS · SYSTEM & UPGRADE GUIDE',
        title: 'Portable Windows Edition Guide',
        html:
          '<p class="nyt-dialog-lead">Twiggo ships as a single portable executable (.exe)—no installer required and ready to run offline.</p>' +
          '<ul>' +
          '<li><strong>WebView2 Runtime</strong>: Requires Microsoft Edge WebView2 (pre-installed on Win11 and modern Win10). If missing on stripped builds, install it from <a href="https://developer.microsoft.com/en-us/microsoft-edge/webview2/" target="_blank" rel="noopener">Microsoft WebView2</a>.</li>' +
          '<li><strong>Seamless Upgrade</strong>: Notes and licenses are stored in your user directory (<code>AppData</code> / <code>~/.goote</code>). Replace the <code>.exe</code> directly to upgrade without losing data.</li>' +
          '<li><strong>SmartScreen Prompt</strong>: Until a commercial code-signing certificate is added, click <strong>More info → Run anyway</strong> on the initial Windows Defender SmartScreen notice.</li>' +
          '</ul>' +
          '<ul class="nyt-dialog-links">' +
          '<li><a href="https://github.com/He-Ruisi/neinote_website/releases" target="_blank" rel="noopener">GitHub Releases Mirror ↓</a></li>' +
          '</ul>'
      },
      privacy: {
        eyebrow: 'PRIVACY POLICY · UPDATED 2026-11-16',
        title: 'Privacy Policy',
        html:
          '<p class="nyt-dialog-lead">Neinote and Twiggo are local-first. Your notes, outlines, and workspace files remain solely on your device.</p>' +
          '<ul>' +
          '<li><strong>Zero Tracking</strong>: No account registration, no behavioral analytics, and no cloud upload of your notes.</li>' +
          '<li><strong>Purchase Records</strong>: When purchasing via Creem, we only receive your order ID, license status, and email for delivery, 3-device activation, and refunds.</li>' +
          '<li><strong>BYOK AI</strong>: If enabled, your API key stays local and requests go directly from your device to your chosen AI provider.</li>' +
          '</ul>' +
          '<p>Contact <a href="mailto:support@tcommon.top">support@tcommon.top</a> to access, export, or delete your order/support records within 30 days.</p>'
      },
      terms: {
        eyebrow: 'TERMS OF SERVICE · UPDATED 2026-11-16',
        title: 'Terms of Service',
        html:
          '<p class="nyt-dialog-lead">These terms govern your use of the Neinote website, desktop app, Twiggo, and Early Supporter Expansion Pack.</p>' +
          '<ul>' +
          '<li><strong>Free Forever Core</strong>: Core features are free for personal and commercial use with no limits or ads.</li>' +
          '<li><strong>Expansion License</strong>: Early Supporter (€9.9) is a non-transferable one-time license covering rolling updates on up to 3 devices, with a 14-day full refund window.</li>' +
          '<li><strong>Ownership</strong>: You own 100% of your notes and local files. Software and theme assets remain the IP of Uno5&amp;.</li>' +
          '</ul>'
      },
      payment: {
        eyebrow: 'PAYMENT & REFUNDS',
        title: 'Payment & Refund Policy',
        html:
          '<p class="nyt-dialog-lead">Payments are securely processed by Creem (creem.io) with zero subscriptions or hidden fees.</p>' +
          '<ol>' +
          '<li><strong>Instant Delivery</strong>: Download links and license keys are emailed immediately after checkout.</li>' +
          '<li><strong>14-Day Refund</strong>: Full no-questions-asked refund within 14 days of purchase.</li>' +
          '<li><strong>Taxes</strong>: Applicable local VAT/sales tax is calculated automatically at checkout by Creem.</li>' +
          '</ol>' +
          '<p>Need help with an order? Email <a href="mailto:support@tcommon.top">support@tcommon.top</a>.</p>'
      },
      contact: {
        eyebrow: 'CONTACT & SUPPORT',
        title: 'Contact & Support',
        html:
          '<p class="nyt-dialog-lead">Support Email: <a href="mailto:support@tcommon.top">support@tcommon.top</a></p>' +
          '<p>We typically reply within 3 business days. Please include your OS version, Twiggo version, and reproduction steps or order ID.</p>'
      }
    }
  };

  /* ---------- 3. Capture-Connect-Convey 液态文字切换 ---------- */
  function setupGooeyWordmark() {
    if (reduceMotion) return;
    var host = document.getElementById('hero-wordmark');
    var group = document.getElementById('gooey-group');
    var t1 = document.getElementById('gooey-t1');
    var t2 = document.getElementById('gooey-t2');
    var blurEl = document.getElementById('gooey-blur');
    if (!host || !group || !t1 || !t2 || !blurEl) return;

    var words = ['Capture', 'Connect', 'Convey'];
    var idx = 0;
    var active = t1;
    var standby = t2;
    var morphing = false;
    var timerId = 0;
    var DURATION = 4200;
    var HOLD = 1600;
    var STD_PEAK = 5.0;

    host.classList.add('is-gooey');

    function easeInOut(p) {
      return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    }

    function morphNext() {
      if (morphing) return;
      morphing = true;
      var nextIdx = (idx + 1) % words.length;
      standby.textContent = words[nextIdx];
      standby.setAttribute('opacity', '0');
      group.style.filter = 'url(#gooey-morph)';

      var start = performance.now();
      function frame(now) {
        var p = Math.min(1, (now - start) / DURATION);
        var e = easeInOut(p);
        var blur = Math.sin(p * Math.PI) * STD_PEAK;

        blurEl.setAttribute('stdDeviation', blur.toFixed(2));
        active.setAttribute('opacity', (1 - e).toFixed(3));
        standby.setAttribute('opacity', e.toFixed(3));
        active.setAttribute('transform', 'translate(0,' + (e * 4).toFixed(2) + ')');
        standby.setAttribute('transform', 'translate(0,' + ((e - 1) * 4).toFixed(2) + ')');

        if (p < 1) {
          requestAnimationFrame(frame);
        } else {
          blurEl.setAttribute('stdDeviation', '0');
          group.style.filter = 'none';
          active.setAttribute('opacity', '0');
          active.removeAttribute('transform');
          standby.setAttribute('opacity', '1');
          standby.removeAttribute('transform');
          var tmp = active;
          active = standby;
          standby = tmp;
          idx = nextIdx;
          morphing = false;
          scheduleNext();
        }
      }
      requestAnimationFrame(frame);
    }

    function scheduleNext() {
      clearTimeout(timerId);
      if (document.hidden) return;
      timerId = setTimeout(morphNext, HOLD);
    }

    host.addEventListener('mouseenter', function () {
      clearTimeout(timerId);
      morphNext();
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !morphing) scheduleNext();
    });

    scheduleNext();
  }

  /* ---------- 4. 从 version.json 同步最新下载信息 ---------- */
  var latestRelease = {
    version: '2.30.2',
    downloadUrl: 'https://download.tcommon.top/twiggo-v2.30.2.exe',
    sizeMB: '28'
  };

  function renderDownloadMeta() {
    var dlBtn = document.getElementById('hero-download-btn');
    var dirDl = document.getElementById('dir-download-link');
    var dlMeta = document.getElementById('hero-download-meta');
    if (dlBtn) {
      dlBtn.href = latestRelease.downloadUrl;
      dlBtn.setAttribute('download', 'twiggo-v' + latestRelease.version + '.exe');
    }
    if (dirDl) {
      dirDl.href = latestRelease.downloadUrl;
      dirDl.setAttribute('download', 'twiggo-v' + latestRelease.version + '.exe');
    }
    if (dlMeta) {
      if (currentLang === 'en') {
        dlMeta.innerHTML =
          'Windows 10/11 · Alpha <span class="nyt-ver-accent">v' + latestRelease.version + '</span> (~' + latestRelease.sizeMB +
          ' MB) · Beta Free (Theme WIP)';
      } else {
        dlMeta.innerHTML =
          'Windows 10/11 · Alpha <span class="nyt-ver-accent">v' + latestRelease.version + '</span>（约 ' + latestRelease.sizeMB +
          ' MB）· Beta 免费（主题打磨中）';
      }
    }
  }

  function syncVersionInfo() {
    renderDownloadMeta();
    fetch('version.json', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('version.json fetch failed');
        return res.json();
      })
      .then(function (data) {
        if (data.version) latestRelease.version = data.version;
        if (data.downloadUrl) latestRelease.downloadUrl = data.downloadUrl;
        if (data.size) latestRelease.sizeMB = Math.round(data.size / (1024 * 1024));
        renderDownloadMeta();
      })
      .catch(function () {});
  }

  /* ---------- 5. 应用中英文切换 ---------- */
  var activePanelKey = null;

  function applyLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'zh';
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-Hans';
    try {
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    } catch (e) {}

    var dict = UI_TEXT[currentLang];
    document.title = dict.pageTitle;

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (dict[key]) nodes[i].textContent = dict[key];
    }

    var langBtn = document.getElementById('nyt-lang-toggle');
    if (langBtn) langBtn.textContent = dict.langBtn;

    updateThemeButtonLabel();

    renderDownloadMeta();

    var dialog = document.getElementById('nyt-dialog');
    if (dialog && dialog.open && activePanelKey) {
      openPanelContent(activePanelKey);
    }
  }

  function openPanelContent(key) {
    var data = (PANELS[currentLang] && PANELS[currentLang][key]) || PANELS.zh[key];
    if (!data) return false;
    activePanelKey = key;
    document.getElementById('nyt-dialog-eyebrow').textContent = data.eyebrow;
    document.getElementById('nyt-dialog-title').textContent = data.title;
    var bodyEl = document.getElementById('nyt-dialog-body');
    bodyEl.innerHTML = data.html;
    bodyEl.scrollTop = 0;
    return true;
  }

  /* ---------- 6. 模态阅读抽屉 (<dialog>) ---------- */
  function setupDialog() {
    var dialog = document.getElementById('nyt-dialog');
    var closeBtn = document.getElementById('nyt-dialog-close');
    if (!dialog) return;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-panel]');
      if (!trigger) return;
      e.preventDefault();
      if (openPanelContent(trigger.getAttribute('data-panel')) && !dialog.open) {
        dialog.showModal();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dialog.close();
      });
    }

    dialog.addEventListener('close', function () {
      activePanelKey = null;
    });

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      var outside = function (e) {
        var r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      var pressedOutside = false;
      dialog.addEventListener('pointerdown', function (e) {
        pressedOutside = outside(e);
      });
      dialog.addEventListener('pointerup', function (e) {
        if (pressedOutside && outside(e)) dialog.close();
      });
    }
  }

  /* ---------- 7. 主题切换（NYT 报纸 / 青绿山水） ---------- */
  var THEME_STORAGE_KEY = 'neinote-nyt-theme';
  var THEMES = ['nyt', 'shanshui'];
  var THEME_LABELS = {
    zh: { nyt: '主题：报纸', shanshui: '主题：青绿' },
    en: { nyt: 'Theme: NYT', shanshui: 'Theme: Jade' }
  };
  var currentTheme = 'nyt';
  try {
    var savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (THEMES.indexOf(savedTheme) !== -1) currentTheme = savedTheme;
  } catch (e) {}

  function updateThemeButtonLabel() {
    var btn = document.getElementById('nyt-theme-toggle');
    if (!btn) return;
    var map = THEME_LABELS[currentLang] || THEME_LABELS.zh;
    btn.textContent = map[currentTheme] || map.nyt;
  }

  function applyTheme(theme) {
    currentTheme = THEMES.indexOf(theme) !== -1 ? theme : 'nyt';
    if (currentTheme === 'nyt') {
      document.documentElement.removeAttribute('data-nyt-theme');
    } else {
      document.documentElement.setAttribute('data-nyt-theme', currentTheme);
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (e) {}
    updateThemeButtonLabel();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupGooeyWordmark();
    syncVersionInfo();
    setupDialog();
    applyTheme(currentTheme);
    applyLanguage(currentLang);

    var themeBtn = document.getElementById('nyt-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var nextIdx = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
        applyTheme(THEMES[nextIdx]);
      });
    }

    var langBtn = document.getElementById('nyt-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        applyLanguage(currentLang === 'zh' ? 'en' : 'zh');
      });
    }
  });
})();

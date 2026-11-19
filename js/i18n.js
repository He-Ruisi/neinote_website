/* =========================================================
   Neinote 中英文双语适配模块 (zh / en)
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'neinote_lang';
  var currentLang = 'zh';
  var zhCache = null;

  /* ---------- 抽屉英文内容 ---------- */
  window.DRAWER_PANELS_EN = {
    boogunote: {
      title: 'Boogunote',
      eyebrow: 'DRAWER 01 / 20',
      html: '<p class="n">PREDECESSOR · 01</p>' +
        '<p class="lead">A lightweight capture tool that makes jotting things down feel effortless.</p>' +
        '<p>No forced taxonomy or heavy structure—just keep the entry point within reach and quietly step aside. Neinote\'s core principle of low presence yet instant convenience comes directly from this.</p>'
    },
    bolt: {
      title: 'bolt.new',
      eyebrow: 'DRAWER 02 / 20',
      html: '<p class="n">PREDECESSOR · 02</p>' +
        '<p class="lead">An AI-powered application prototyping environment in the browser.</p>' +
        '<p>In May 2025, I built the very first rough skeleton of Neinote here, crossing the frontend barrier for the first time.</p>' +
        '<ul class="links">' +
        '<li><a href="https://bolt.new" target="_blank" rel="noopener">Official Site · bolt.new<span class="ext">↗</span></a></li>' +
        '<li><a href="#download" data-drawer="download">Download Twiggo<span class="ext">→</span></a></li>' +
        '</ul>'
    },
    notion: {
      title: 'Notion',
      eyebrow: 'DRAWER 03 / 20',
      html: '<p class="n">PREDECESSOR · 03</p>' +
        '<p class="lead">Proved that structure can be fluid rather than rigid folders.</p>' +
        '<p>It inspired the versatility of blocks and containers, while Neinote focuses on zero-friction capture at the moment a thought arrives.</p>' +
        '<ul class="links">' +
        '<li><a href="https://www.notion.so" target="_blank" rel="noopener">Official Site · notion.so<span class="ext">↗</span></a></li>' +
        '</ul>'
    },
    obsidian: {
      title: 'Obsidian',
      eyebrow: 'DRAWER 04 / 20',
      html: '<p class="n">PREDECESSOR · 04</p>' +
        '<p class="lead">A textbook example of local-first Markdown and bidirectional links.</p>' +
        '<p>Plain-text files paired with a great editor are enough to build a lasting thinking system. Neinote\'s local-first promise is rooted in this conviction.</p>' +
        '<ul class="links">' +
        '<li><a href="https://obsidian.md" target="_blank" rel="noopener">Official Site · obsidian.md<span class="ext">↗</span></a></li>' +
        '</ul>'
    },
    roam: {
      title: 'Roam Research',
      eyebrow: 'DRAWER 05 / 20',
      html: '<p class="n">PREDECESSOR · 05</p>' +
        '<p class="lead">Networked thought: let one idea live in multiple contexts at once.</p>' +
        '<p>Outlines and block references taught me that what matters isn\'t filing into a single folder, but letting scattered thoughts connect.</p>' +
        '<ul class="links">' +
        '<li><a href="https://roamresearch.com" target="_blank" rel="noopener">Official Site · roamresearch.com<span class="ext">↗</span></a></li>' +
        '</ul>'
    },
    sayit: {
      title: 'Sayit',
      eyebrow: 'DRAWER 06 / 20',
      html: '<p class="n">PREDECESSOR · 06</p>' +
        '<p class="lead">Compress the distance between thinking and writing to near zero.</p>' +
        '<p>When inspiration strikes, switching windows or typing a title kills it. Twiggo\'s "glide in to write, glide out to hide" is a direct answer to this.</p>'
    },
    treesheets: {
      title: 'TreeSheets',
      eyebrow: 'DRAWER 07 / 20',
      html: '<p class="n">PREDECESSOR · 07</p>' +
        '<p class="lead">Trees and tables can be one and the same thing.</p>' +
        '<p>A minimal hierarchical container that proves an honest underlying structure needs no bloated presets to hold notes and plans.</p>' +
        '<ul class="links">' +
        '<li><a href="https://strlen.com/treesheets/" target="_blank" rel="noopener">Official Site · strlen.com/treesheets<span class="ext">↗</span></a></li>' +
        '</ul>'
    },
    wdtp: {
      title: 'WDTP',
      eyebrow: 'DRAWER 08 / 20',
      html: '<p class="n">PREDECESSOR · 08</p>' +
        '<p class="lead">An exemplar of small, sharp software.</p>' +
        '<p>Restrained without feature bloat or retention tricks. Neinote\'s pledge that core features stay free forever comes from this restraint.</p>'
    },
    flutter: {
      title: 'Flutter',
      eyebrow: 'DRAWER 09 / 20',
      html: '<p class="n">REWRITES · 09</p>' +
        '<p class="lead">First attempt: one codebase across three platforms.</p>' +
        '<p>Desktop cursor behavior, IME compatibility, and native window feel fell short of expectations, so I moved on.</p>' +
        '<ul class="links">' +
        '<li><a href="#wails" data-drawer="wails">See the final architecture<span class="ext">→</span></a></li>' +
        '</ul>'
    },
    reactvue: {
      title: 'Pure Frontend (React / Vue)',
      eyebrow: 'DRAWER 10 / 20',
      html: '<p class="n">REWRITES · 10</p>' +
        '<p class="lead">Second attempt: build the interface first.</p>' +
        '<p>Pure web frontends struggle to handle system trays, global hotkeys, and local file I/O gracefully, though this laid the foundation for the UI layout.</p>'
    },
    tauri: {
      title: 'Tauri',
      eyebrow: 'DRAWER 11 / 20',
      html: '<p class="n">REWRITES · 11</p>' +
        '<p class="lead">Third attempt: a lightweight desktop shell.</p>' +
        '<p>Fast startup and tiny binary size, but cross-platform packaging and subtle window quirks led me to rebuild once more.</p>' +
        '<ul class="links">' +
        '<li><a href="#dualwindow" data-drawer="dualwindow">Explore dual-window interaction<span class="ext">→</span></a></li>' +
        '</ul>'
    },
    wails: {
      title: 'React + Go + Wails v3',
      eyebrow: 'DRAWER 12 / 20',
      html: '<p class="n">REWRITES · 12</p>' +
        '<p class="lead">Final form: React UI + Go backend + Wails v3 bridge.</p>' +
        '<p>React handles expression, Go reliably manages files, trays, and OS hooks, and Wails v3 connects them cleanly—a pragmatic stack a solo developer can carry all the way.</p>' +
        '<ul class="links">' +
        '<li><a href="#dualwindow" data-drawer="dualwindow">Dual-window paradigm<span class="ext">→</span></a></li>' +
        '<li><a href="#download" data-drawer="download">Download for Windows<span class="ext">→</span></a></li>' +
        '</ul>'
    },
    dualwindow: {
      title: 'Auto-Hide Drawer + Main Workspace',
      eyebrow: 'DRAWER 13 / 20',
      html: '<p class="n">INTERACTION · 13</p>' +
        '<p class="lead">Two windows, two levels of presence.</p>' +
        '<p><strong>Floating Drawer (Twiggo)</strong>: Docks to the screen edge; glide in to capture, glide out to hide.</p>' +
        '<p><strong>Main Workspace</strong>: A full two-pane studio for deep organization and search. Both share local data seamlessly.</p>'
    },
    twiggo: {
      title: 'Twiggo',
      eyebrow: 'DRAWER 14 / 20',
      html: '<p class="n">PRODUCT · 14</p>' +
        '<p class="lead">A floating drawer like a shadow, and an outliner like a growing tree.</p>' +
        '<ul>' +
        '<li>Infinite-depth outline stored locally in plain Markdown</li>' +
        '<li>Edge auto-hide &amp; global hotkeys without switching windows</li>' +
        '<li>No account required, no forced cloud sync, no feeds</li>' +
        '</ul>' +
        '<div class="drawer-addon-card">' +
        '<div class="drawer-addon-head">' +
        '<div class="drawer-addon-meta">' +
        '<span class="drawer-addon-name">Early Supporter Pack</span>' +
        '<span class="drawer-addon-badge">€9.9 One-Time</span>' +
        '</div>' +
        '<a href="#sec3" class="drawer-addon-service-link" data-close-drawer>View Services →</a>' +
        '</div>' +
        '<div class="drawer-addon-action">' +
        '<a href="https://www.creem.io/payment/prod_VxpSzIiS2k61pxLgti8j1" data-creem-checkout data-creem-theme="light" class="creem-btn" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:12px;border:2px solid #151617;background:#FFBE98;color:#151617;box-shadow:0 3px 0 0 #151617;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1;cursor:pointer;text-decoration:none"><svg width="15" height="15" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex:0 0 auto"><path d="M22.1102 11C24.1187 11 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z" fill="#151617"/></svg><span>Buy with Creem</span></a>' +
        '</div>' +
        '</div>' +
        '<ul class="links">' +
        '<li><a href="#download" data-drawer="download">Download Twiggo<span class="ext">→</span></a></li>' +
        '<li><a href="#theme" data-drawer="theme">Early Supporter Pack<span class="ext">→</span></a></li>' +
        '</ul>'
    },
    theme: {
      title: 'Early Supporter Pack',
      eyebrow: 'DRAWER 15 / 20',
      html: '<p class="n">EARLY SUPPORTER · €9.9</p>' +
        '<p class="lead">Core features are free forever. Become an Early Supporter with a €9.9 one-time purchase to unlock the full expansion pack (early-stage pricing).</p>' +
        '<h4>What\'s Included</h4>' +
        '<ul>' +
        '<li><strong>01 / Theme Pack</strong>: 6 built-in minimal themes &amp; typography presets, plus two full expansion themes (Chinese Landscape &amp; Retro Pixel) with colors, fonts, icons, and sound effects.</li>' +
        '<li><strong>02 / Plugin Pack</strong>: Built-in clipboard and screenshot plugins, with upcoming extensions for PDF reading, browser annotations, AI chat, and more.</li>' +
        '<li><strong>03 / License &amp; Updates</strong>: Activate on up to 3 devices; one-time purchase with no subscription and continuous rolling updates.</li>' +
        '</ul>' +
        '<div class="drawer-creem-box">' +
        '<div class="drawer-creem-note">' +
        '<strong>€9.9 One-Time Purchase</strong><br>' +
        'Up to 3 devices · Rolling updates · 14-day refund guarantee' +
        '</div>' +
        '<a href="https://www.creem.io/payment/prod_VxpSzIiS2k61pxLgti8j1" data-creem-checkout data-creem-theme="light" class="creem-btn" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:12px;border:2px solid #151617;background:#FFBE98;color:#151617;box-shadow:0 3px 0 0 #151617;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1;cursor:pointer;text-decoration:none"><svg width="15" height="15" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex:0 0 auto"><path d="M22.1102 11C24.1187 11 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z" fill="#151617"/></svg><span>Buy with Creem</span></a>' +
        '</div>' +
        '<h4>Payment, Delivery &amp; Refunds</h4>' +
        '<ol>' +
        '<li><strong>Secure Checkout</strong>: Processed by Creem (creem.io), with local taxes calculated automatically at checkout.</li>' +
        '<li><strong>Instant Delivery</strong>: Download links and license keys are sent directly to your email after payment.</li>' +
        '<li><strong>14-Day Refund</strong>: Full no-questions-asked refund within 14 days of purchase; compatibility issues beyond 14 days are handled case by case.</li>' +
        '</ol>' +
        '<ul class="links">' +
        '<li><a href="#terms" data-drawer="terms">Terms of Service<span class="ext">→</span></a></li>' +
        '<li><a href="mailto:support_neinote@tcommons.top">Contact for Refund or Support<span class="ext">✉</span></a></li>' +
        '</ul>'
    },
    privacy: {
      title: 'Privacy Policy',
      eyebrow: 'DRAWER 16 / 20',
      html: '<p class="n">PRIVACY POLICY · UPDATED 2026-11-16</p>' +
        '<p class="lead">Neinote and Twiggo are local-first by design. Your notes, outlines, and workspace data stay strictly on your own device.</p>' +
        '<h4>1. Data We Do Not Collect</h4>' +
        '<p>We do not require account registration, do not run behavioral analytics or user profiling, and do not upload or store your notes on any cloud server.</p>' +
        '<h4>2. Information Collected for Purchases &amp; Support</h4>' +
        '<ul>' +
        '<li><strong>Order &amp; License Records</strong>: When you purchase the Early Supporter pack via <strong>Creem (creem.io)</strong>, Creem processes your payment and shares only your order ID, license status, and email address with us for delivery, 3-device activation, and refund support. We never access or store your card details.</li>' +
        '<li><strong>Support Emails</strong>: Messages sent to <a class="link" href="mailto:support_neinote@tcommons.top">support_neinote@tcommons.top</a> are used solely to respond to your inquiry.</li>' +
        '</ul>' +
        '<h4>3. Third-Party Services &amp; BYOK AI</h4>' +
        '<p>If you enable Bring-Your-Own-Key (BYOK) AI features, your API key is stored locally and requests are sent directly from your device to your chosen AI provider under that provider\'s privacy policy. This website is hosted on GitHub / Cloudflare and loads static web fonts via public CDNs.</p>' +
        '<h4>4. Security &amp; Local Backups</h4>' +
        '<p>Because your data resides locally, you have complete control—and responsibility—over securing and backing up your local files.</p>' +
        '<h4>5. Children\'s Privacy</h4>' +
        '<p>Our software and website are not directed to children under 13 (or the minimum age required by applicable law), and we do not knowingly collect personal data from children.</p>' +
        '<h4>6. Your Rights &amp; Contact</h4>' +
        '<p>You may request access to, correction of, export of, or deletion of your order or support email records at any time by contacting <a class="link" href="mailto:support_neinote@tcommons.top">support_neinote@tcommons.top</a>. We respond within 30 days.</p>' +
        '<h4>7. Changes to This Policy</h4>' +
        '<p>We may update this Privacy Policy as the product evolves; material updates will be reflected here with a revised date.</p>' +
        '<ul class="links">' +
        '<li><a href="#terms" data-drawer="terms">Terms of Service<span class="ext">→</span></a></li>' +
        '<li><a href="mailto:support_neinote@tcommons.top">Support Email<span class="ext">✉</span></a></li>' +
        '</ul>'
    },
    terms: {
      title: 'Terms of Service',
      eyebrow: 'DRAWER 17 / 20',
      html: '<p class="n">TERMS OF SERVICE · UPDATED 2026-11-16</p>' +
        '<p class="lead">These Terms govern your access to and use of the Neinote website, desktop application, Twiggo, and the Early Supporter expansion pack.</p>' +
        '<h4>1. Free Core Commitment</h4>' +
        '<p>Core features of Neinote and Twiggo are free forever for personal and commercial note-taking, with no usage limits and no advertisements.</p>' +
        '<h4>2. Early Supporter Pack, Licensing &amp; Refunds</h4>' +
        '<ul>' +
        '<li><strong>One-Time Purchase</strong>: Becoming an Early Supporter (€9.9 early-stage pricing, subject to adjustment as the project progresses) grants a non-transferable license for the expansion pack with rolling updates and activation on up to <strong>3 devices</strong>.</li>' +
        '<li><strong>Payment &amp; Taxes</strong>: Checkout and applicable regional taxes are handled by <strong>Creem (creem.io)</strong>.</li>' +
        '<li><strong>14-Day Refund</strong>: You may request a full, no-questions-asked refund within 14 days of purchase.</li>' +
        '</ul>' +
        '<h4>3. Ownership &amp; Intellectual Property</h4>' +
        '<p>You retain 100% ownership of all notes, outlines, and files you create. The Neinote/Twiggo software, UI design, themes, icons, sound assets, and source code remain the intellectual property of the developer (Uno5&amp;).</p>' +
        '<h4>4. Acceptable Use &amp; Restrictions</h4>' +
        '<p>You agree not to decompile, reverse-engineer, redistribute, or resell the software or paid expansion packs, and not to use BYOK AI integrations for unlawful, fraudulent, or infringing purposes.</p>' +
        '<h4>5. Third-Party Services</h4>' +
        '<p>Third-party providers (including Creem for payments, GitHub/Cloudflare for hosting, and any AI API provider you configure) are governed by their own terms and policies.</p>' +
        '<h4>6. Disclaimer &amp; Limitation of Liability</h4>' +
        '<p>The software is provided "as is" without warranties of any kind. Please back up important local data regularly. To the maximum extent permitted by law, total liability for any claim is limited to the amount you paid for the expansion pack in the preceding 12 months.</p>' +
        '<h4>7. Updates &amp; Contact</h4>' +
        '<p>We may revise these Terms as Neinote evolves. Continued use constitutes acceptance of the updated Terms. Questions may be sent to <a class="link" href="mailto:support_neinote@tcommons.top">support_neinote@tcommons.top</a>.</p>' +
        '<ul class="links">' +
        '<li><a href="#theme" data-drawer="theme">Early Supporter &amp; Refunds<span class="ext">→</span></a></li>' +
        '<li><a href="#privacy" data-drawer="privacy">Privacy Policy<span class="ext">→</span></a></li>' +
        '</ul>'
    },
    payment: {
      title: 'Payment & Refunds',
      eyebrow: 'DRAWER 18 / 20',
      html: '<p class="n">PAYMENT &amp; REFUNDS · 2025-11-14</p>' +
        '<p class="lead">Securely processed by creem.io—no subscriptions, no hidden fees.</p>' +
        '<ol>' +
        '<li><strong>Delivery</strong>: Download links and license keys are emailed immediately after checkout.</li>' +
        '<li><strong>Refunds</strong>: Full refund within 14 days for any reason; later device compatibility issues handled individually.</li>' +
        '<li><strong>Taxes</strong>: Calculated automatically by creem.io at checkout based on your region.</li>' +
        '</ol>' +
        '<ul class="links">' +
        '<li><a href="#terms" data-drawer="terms">Terms of Service<span class="ext">→</span></a></li>' +
        '<li><a href="mailto:support_neinote@tcommons.top">Request a Refund<span class="ext">✉</span></a></li>' +
        '</ul>'
    },
    contact: {
      title: 'Contact & Support',
      eyebrow: 'DRAWER 19 / 20',
      html: '<p class="n">CONTACT &amp; SUPPORT</p>' +
        '<div class="mail-row">' +
        '<p class="lead" style="margin:0">Email: <a class="link" href="mailto:support_neinote@tcommons.top">support_neinote@tcommons.top</a></p>' +
        '<button type="button" class="copy-btn dark" data-copy="support_neinote@tcommons.top">Copy</button>' +
        '</div>' +
        '<p>Usually replies within 3 business days. Please include your OS, app version, repro steps, or order ID.</p>'
    },
    download: {
      title: 'Download Twiggo',
      eyebrow: 'DRAWER 20 / 20',
      html: '<p class="n">DOWNLOAD · ALPHA 2.2.1</p>' +
        '<p class="lead">Windows standalone portable executable (EXE · ~26 MB), offline-ready. macOS &amp; Linux coming soon.</p>' +
        '<div style="margin:20px 0 14px">' +
        '<a class="btn-nav-cta" style="width:100%;height:44px;font-size:12px" href="https://download.tcommons.top/twiggo-alpha-2.2.1.exe" download="twiggo-alpha-2.2.1.exe" rel="noopener">Download Windows Portable (EXE · ~26 MB)</a>' +
        '</div>' +
        '<div class="drawer-addon-card">' +
        '<div class="drawer-addon-head">' +
        '<div class="drawer-addon-meta">' +
        '<span class="drawer-addon-name">Early Supporter Pack</span>' +
        '<span class="drawer-addon-badge">€9.9 One-Time</span>' +
        '</div>' +
        '<a href="#sec3" class="drawer-addon-service-link" data-close-drawer>View Services →</a>' +
        '</div>' +
        '<div class="drawer-addon-action">' +
        '<a href="https://www.creem.io/payment/prod_VxpSzIiS2k61pxLgti8j1" data-creem-checkout data-creem-theme="light" class="creem-btn" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:12px;border:2px solid #151617;background:#FFBE98;color:#151617;box-shadow:0 3px 0 0 #151617;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1;cursor:pointer;text-decoration:none"><svg width="15" height="15" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex:0 0 auto"><path d="M22.1102 11C24.1187 11 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z" fill="#151617"/></svg><span>Buy with Creem</span></a>' +
        '</div>' +
        '</div>' +
        '<details class="drawer-fold">' +
        '<summary>Portable Setup &amp; Notes (WebView2 / SmartScreen / Data)</summary>' +
        '<div class="drawer-fold-body">' +
        '<p><strong>System &amp; WebView2</strong>: Requires Win10 (1809)+ / Win11 (Edge WebView2 pre-installed). If a stripped/older Win10 fails to launch, install <a class="link" href="https://developer.microsoft.com/en-us/microsoft-edge/webview2/" target="_blank" rel="noopener">Edge WebView2</a>.</p>' +
        '<p><strong>Portable Upgrades</strong>: No NSIS installer. Notes &amp; license stay in your user folder (<code>AppData</code> / <code>~/.goote</code>); just replace the <code>.exe</code> to upgrade safely.</p>' +
        '<p><strong>SmartScreen Notice</strong>: Without a commercial code-signing cert yet, click <strong>"More info" → "Run anyway"</strong> if Windows shows a blue dialog.</p>' +
        '</div>' +
        '</details>' +
        '<ul class="links">' +
        '<li><a href="https://github.com/He-Ruisi/neinote_website/releases/download/v2.2.1-alpha/twiggo-alpha-2.2.1.exe" download="twiggo-alpha-2.2.1.exe" rel="noopener">GitHub Releases Mirror<span class="ext">↓</span></a></li>' +
        '<li><a href="#theme" data-drawer="theme">Early Supporter Pack Details<span class="ext">→</span></a></li>' +
        '<li><a href="#privacy" data-drawer="privacy">Privacy Policy<span class="ext">→</span></a></li>' +
        '</ul>'
    }
  };

  /* ---------- 页面英文文案映射 ---------- */
  var EN_PAGE = {
    title: 'Neinote · Twiggo',
    navLinks: ['Origin', 'Twiggo', 'Services', 'Terms'],
    tocBtn: 'Outline',
    ctaBtn: 'Get Twiggo',
    sideNote: 'Solo developer with limited time &amp; energy—the app and site still have rough edges. <a class="link" href="#contact" data-drawer="contact">Feedback</a> is always welcome.',
    tocItems: ['Top', 'Origin', 'Twiggo', 'Download & Services', 'Privacy & Terms', 'Footer'],
    tagline: 'Where scattered fragments converge into life itself.',
    sec1Title: 'Origin',
    sec1P1: 'I\'m Uno5&amp;, an ordinary indie developer. Neinote began with my love-hate relationship with productivity tools. As a quintessential tool enthusiast, I\'m always trying new apps—yet day after day I kept muttering: "Why is this missing? Why can\'t it go one step further? Why isn\'t the flow simpler?" When that accumulated friction finally boiled over, I decided to stop waiting and build one myself.',
    sec1P2: 'Though the idea had lingered for years, it wasn\'t until May 2025 that I built the first rough prototype on <a class="link" href="#bolt" data-drawer="bolt">bolt.new</a>. Truthfully, aside from having a Markdown editor, that crude prototype bears little resemblance to Neinote today—but that\'s how it all began.',
    fig1Cap: 'FIG.01 — Pen and paper hold an irreplaceable charm: sketch freely and let thoughts flow.',
    sec1P3: 'You can see echoes of many remarkable predecessors in Neinote—from <a class="link" href="#boogunote" data-drawer="boogunote">Boogunote</a>, <a class="link" href="#notion" data-drawer="notion">Notion</a>, <a class="link" href="#roam" data-drawer="roam">Roam Research</a>, and <a class="link" href="#obsidian" data-drawer="obsidian">Obsidian</a> to <a class="link" href="#sayit" data-drawer="sayit">Sayit</a>, <a class="link" href="#wdtp" data-drawer="wdtp">WDTP</a>, and <a class="link" href="#treesheets" data-drawer="treesheets">TreeSheets</a> (listed alphabetically)—all of them deeply inspired me. Neinote grew directly out of my real-world capture and organization habits.',
    sec1P4: 'With only modest experience in Java, C++, and MATLAB, frontend development was completely uncharted territory. Collaborating with generative AI, I embarked on a long, stubborn journey. My sincere thanks to <a class="link" href="https://aistudio.xiaomimimo.com" target="_blank" rel="noopener">Xiaomimo Studio</a>, <a class="link" href="https://kiro.dev" target="_blank" rel="noopener">Kiro</a>, <a class="link" href="https://openai.com/codex/" target="_blank" rel="noopener">Codex</a>, <a class="link" href="https://www.anthropic.com/claude-code" target="_blank" rel="noopener">Claudecode</a>, <a class="link" href="https://www.trae.ai" target="_blank" rel="noopener">Trae</a>, and especially <a class="link" href="https://antigravity.google" target="_blank" rel="noopener">Antigravity</a>—90% of this project was built inside <a class="link" href="https://antigravity.google" target="_blank" rel="noopener">Antigravity IDE</a>. Through relentless rewrites, I tried <a class="link" href="#flutter" data-drawer="flutter">Flutter</a>, <a class="link" href="#reactvue" data-drawer="reactvue">pure React / Vue</a>, and <a class="link" href="#tauri" data-drawer="tauri">Tauri</a>, going through 10+ major refactors, 7 major versions, a dozen branches, and hundreds of iterations—until the 7th major refactor settled on <a class="link" href="#wails" data-drawer="wails">React + Go + Wails v3</a> with an <a class="link" href="#dualwindow" data-drawer="dualwindow">auto-hide floating drawer + main workspace</a>.',
    dossierCap: 'DOSSIER — 4 stages · 10+ rewrites · 7 major versions · 100+ iterations',
    matrixLabels: ['Stages', 'Major rewrites', 'Major versions', 'Iterations'],
    sec1P5: 'Looking back, the design feels obvious and natural—yet the road to "making sense" was anything but smooth. Even with pioneers showing the way, hitting dead ends and pulling back from cliffs was part of my path. I still don\'t know how far Neinote is from its ultimate form, or whether my intuition of "right" is truly right—but for now, we get along wonderfully, and the convenience it brings is already the greatest value I could create for myself.',
    thanksQuote: 'Click here to view the full acknowledgments.',
    thanksGroupTitles: [
      'AI Collaboration &amp; Dev Environments',
      'Reference Apps (Inspiration &amp; Predecessors)',
      'Core Tech Stack',
      'Hosting, Network &amp; Payment Platforms',
      'Typography',
      'Fellow Travelers'
    ],
    thanksTags: ['#Notes', '#Quick Notes', '#PKM', '#Long-form', '#Special'],
    thanksCompanions: 'Thank you to everyone who offered suggestions, tested early builds, and encouraged me along the way.',
    companionTitle: 'To the Revered, the Beloved, and the Dear',
    companionText: 'My heartfelt gratitude goes to my grandma—the greatest woman in the world! Thank you to my cat, Doremi, for always staying by my side. And finally, thank you to myself!',
    sec2Title: '<a class="link" href="#twiggo" data-drawer="twiggo" style="text-decoration:none">Twiggo</a>',
    sec2P1: 'Allow me to introduce the heart of Neinote—<a class="link" href="#twiggo" data-drawer="twiggo">Twiggo</a>. What happens when desktop Org-mode meets Markdown? Twiggo is both a floating drawer like a shadow and an outliner like a growing tree. Light, nimble, low-presence yet always ready: no window switching needed—glide your mouse in to capture, glide out to hide. Let your thoughts branch out and accumulate node by node.',
    fig2Cap: 'FIG.02 — Twiggo live demo: edge-docked floating capture &amp; hierarchical outline',
    galleryEyebrow: 'SCREENSHOTS · REAL INTERFACE',
    galleryTitle: 'Real Interface Snapshots',
    galleryTags: ['01 · Export', '02 · Filter', '03 · Network', '04 · Style'],
    galleryCardTitles: [
      'Seal & Signature',
      'Multi-Dimensional Matrix',
      'Mentions & Daily Links',
      'Dark Mode & Retro Themes'
    ],
    galleryCardDescs: [
      'Custom plant seals, author signatures, and epigraphs for distinct document exports.',
      'Instantly filter by progress (Todo/Done), priority (Star/Urgent), or thought notes.',
      'Type @ to link daily notes or reference nodes on the fly—networked thoughts with ease.',
      'Toggle seamlessly between Modern clean UI and Retro 8-bit styles with subtle dot paper.'
    ],
    sec3Title: 'Download &amp; Services',
    sec3P1: 'For practical reasons the project is not open-source at this stage, yet I make one firm promise: <strong style="font-weight:500">all core features are free forever with zero usage limits.</strong>',
    sec3P2: 'If you enjoy it, consider becoming an <a class="link" href="#theme" data-drawer="theme">Early Supporter</a> (€9.9 one-time purchase with the full expansion pack included) to support development. The goal of Neinote and <a class="link" href="#twiggo" data-drawer="twiggo">Twiggo</a> remains simple: catch fleeting sparks of thought and bring clarity to everyday life.',
    dlWinRight: 'EXE · ~26 MB · Alpha 2.2.1',
    dlSoon: 'COMING SOON',
    dlNotesTitle: 'Windows Portable Executable Notes',
    dlNotesList:
      '<li><strong>WebView2 Runtime</strong>: Relies on Microsoft Edge WebView2 (pre-installed on Win11 &amp; modern Win10). If a stripped or older Win10 fails to launch, please install <a class="link" href="https://developer.microsoft.com/en-us/microsoft-edge/webview2/" target="_blank" rel="noopener">Edge WebView2 Runtime</a>.</li>' +
      '<li><strong>Portable &amp; Safe Upgrades</strong>: Distributed as a standalone executable (no NSIS installer). Notes and license config reside in your user directory (e.g. <code>AppData</code> / <code>~/.goote</code>)—simply replace the <code>.exe</code> to upgrade without losing data.</li>' +
      '<li><strong>SmartScreen Notice</strong>: Without a commercial code-signing certificate yet, Windows may show a blue protection dialog on first launch—click <strong>"More info" → "Run anyway"</strong>.</li>',
    s1Title: 'S1 · Early Supporter',
    s1Price: '€9.9 One-Time',
    s1Right: 'Details &amp; Creem Checkout',
    addonTitles: ['01 / Theme Pack', '02 / Plugin Pack', '03 / License &amp; Updates'],
    addonLists: [
      '<li>6 built-in minimal themes &amp; typography presets</li><li>Expansion adds "Chinese Landscape" &amp; "Retro Pixel" themes</li><li>Each theme includes colors, fonts, icons &amp; sound effects</li>',
      '<li>Built-in clipboard &amp; screenshot plugins</li><li>Upcoming: PDF reader, browser annotations &amp; more</li><li>Supports AI chat and extensible workflows</li>',
      '<li>Included automatically when you become an Early Supporter</li><li>Early-stage pricing, adjusted as the project matures</li><li>Activate on up to 3 devices with rolling updates</li><li>Secure Creem checkout · 14-day no-questions-asked refund</li>'
    ],
    addonFootName: 'Early Supporter Pack',
    addonFootBadge: '€9.9 One-Time',
    addonFootDesc: 'All themes &amp; plugins included · Up to 3 devices · 14-day refund',
    sec4Title: 'Privacy &amp; Terms',
    sec4P1: 'Neinote is local-first from the ground up—your data stays solely in your hands. Future AI integrations will only support bring-your-own-key (BYOK) configuration to protect your privacy.',
    sec4P2: 'You can read our full <a class="link" href="#privacy" data-drawer="privacy">Privacy Policy</a>, <a class="link" href="#terms" data-drawer="terms">Terms of Service</a>, and <a class="link" href="#payment" data-drawer="payment">Payment &amp; Refund Policy</a> at any time.',
    sec4P3: 'Questions or feedback? Reach out at <a class="link" href="#contact" data-drawer="contact">support_neinote@tcommons.top</a>.',
    footerTitle: 'Neinote &amp; Twiggo &nbsp;&bull;&nbsp; &copy; 2026 Neinote',
    footerMailLabel: 'Support Email:',
    footerLinks: [
      'Early Supporter Pack &amp; Refunds (€9.9)',
      'Privacy Policy',
      'Terms of Service',
      'Contact Support'
    ]
  };

  function captureZh() {
    if (zhCache) return;
    var q = function (s) { return document.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

    zhCache = {
      title: document.title,
      navLinks: qa('.nav-links a').map(function (el) { return el.innerHTML; }),
      tocBtn: q('#btn-toc-toggle span') ? q('#btn-toc-toggle span').textContent : '',
      ctaBtn: q('.btn-nav-cta') ? q('.btn-nav-cta').textContent : '',
      sideNote: q('.side-note-text') ? q('.side-note-text').innerHTML : '',
      tocItems: qa('.toc-item a span:last-child').map(function (el) { return el.textContent; }),
      tagline: q('.tagline') ? q('.tagline').textContent : '',
      sec1Title: q('#sec1 h2.display') ? q('#sec1 h2.display').innerHTML : '',
      sec1Ps: qa('#sec1 > p.reveal').map(function (el) { return el.innerHTML; }),
      fig1Cap: q('#fig-origin figcaption') ? q('#fig-origin figcaption').innerHTML : '',
      matrixLabels: qa('#sec1 .matrix .cell p').map(function (el) { return el.textContent; }),
      thanksQuote: q('.thanks-quote') ? q('.thanks-quote').textContent : '',
      thanksGroupTitles: qa('.thanks-group h4').map(function (el) { return el.innerHTML; }),
      thanksTags: qa('.thanks-tag').map(function (el) { return el.textContent; }),
      thanksCompanions: q('.thanks-group:last-child p') ? q('.thanks-group:last-child p').innerHTML : '',
      companionTitle: q('.companion-title') ? q('.companion-title').innerHTML : '',
      companionText: q('.companion-text') ? q('.companion-text').innerHTML : '',
      sec2Title: q('#sec2 h2.display') ? q('#sec2 h2.display').innerHTML : '',
      sec2P1: q('#sec2 > p.reveal') ? q('#sec2 > p.reveal').innerHTML : '',
      fig2Cap: q('#sec2 .video-showcase figcaption') ? q('#sec2 .video-showcase figcaption').innerHTML : '',
      galleryEyebrow: q('.gallery-eyebrow') ? q('.gallery-eyebrow').textContent : '',
      galleryTitle: q('.gallery-title') ? q('.gallery-title').textContent : '',
      galleryTags: qa('.gallery-tag').map(function (el) { return el.textContent; }),
      galleryCardTitles: qa('.gallery-card-title').map(function (el) { return el.textContent; }),
      galleryCardDescs: qa('.gallery-card-desc').map(function (el) { return el.textContent; }),
      sec3Title: q('#sec3 .subdisplay') ? q('#sec3 .subdisplay').innerHTML : '',
      sec3Ps: qa('#sec3 > p.reveal').map(function (el) { return el.innerHTML; }),
      dlRights: qa('#sec3 .dl-stack:first-of-type .dl .right').map(function (el) { return el.innerHTML; }),
      dlNotesTitle: q('.dl-notes-title') ? q('.dl-notes-title').textContent : '',
      dlNotesList: q('.dl-notes-list') ? q('.dl-notes-list').innerHTML : '',
      s1Title: q('.dl-addon-head .os') ? q('.dl-addon-head .os').textContent : '',
      s1Price: q('.dl-addon-head .addon-price') ? q('.dl-addon-head .addon-price').textContent : '',
      s1Right: q('.dl-addon-head .right') ? q('.dl-addon-head .right').innerHTML : '',
      addonTitles: qa('.addon-item h4').map(function (el) { return el.innerHTML; }),
      addonLists: qa('.addon-item .addon-list').map(function (el) { return el.innerHTML; }),
      addonFootName: q('.addon-foot-name') ? q('.addon-foot-name').textContent : '',
      addonFootBadge: q('.addon-foot-badge') ? q('.addon-foot-badge').textContent : '',
      addonFootDesc: q('.addon-foot-desc') ? q('.addon-foot-desc').textContent : '',
      sec4Title: q('#sec4 h2.display') ? q('#sec4 h2.display').innerHTML : '',
      sec4Ps: qa('#sec4 > p.reveal').map(function (el) { return el.innerHTML; }),
      footerTitle: q('.footer-title') ? q('.footer-title').innerHTML : '',
      footerMailLabel: q('.footer-mail-line span') ? q('.footer-mail-line span').textContent : '',
      footerLinks: qa('.footer-links-line a').map(function (el) {
        var span = el.querySelector('span:last-child');
        return span ? span.innerHTML : el.innerHTML;
      })
    };
  }

  function applyLang(lang, persist) {
    captureZh();
    currentLang = lang === 'en' ? 'en' : 'zh';
    var q = function (s) { return document.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-Hans';
    var toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = currentLang === 'en' ? '中' : 'EN';
      toggleBtn.setAttribute('aria-label', currentLang === 'en' ? '切换为中文' : 'Switch to English');
    }

    if (currentLang === 'zh') {
      document.title = zhCache.title;
      qa('.nav-links a').forEach(function (el, i) { if (zhCache.navLinks[i] != null) el.innerHTML = zhCache.navLinks[i]; });
      if (q('#btn-toc-toggle span')) q('#btn-toc-toggle span').textContent = zhCache.tocBtn;
      if (q('.btn-nav-cta')) q('.btn-nav-cta').textContent = zhCache.ctaBtn;
      if (q('.side-note-text')) q('.side-note-text').innerHTML = zhCache.sideNote;
      qa('.toc-item a span:last-child').forEach(function (el, i) { if (zhCache.tocItems[i] != null) el.textContent = zhCache.tocItems[i]; });
      if (q('.tagline')) q('.tagline').textContent = zhCache.tagline;
      if (q('#sec1 h2.display')) q('#sec1 h2.display').innerHTML = zhCache.sec1Title;
      qa('#sec1 > p.reveal').forEach(function (el, i) { if (zhCache.sec1Ps[i] != null) el.innerHTML = zhCache.sec1Ps[i]; });
      if (q('#fig-origin figcaption')) q('#fig-origin figcaption').innerHTML = zhCache.fig1Cap;
      qa('#sec1 .matrix .cell p').forEach(function (el, i) { if (zhCache.matrixLabels[i] != null) el.textContent = zhCache.matrixLabels[i]; });
      if (q('.thanks-quote')) q('.thanks-quote').textContent = zhCache.thanksQuote;
      qa('.thanks-group h4').forEach(function (el, i) { if (zhCache.thanksGroupTitles[i] != null) el.innerHTML = zhCache.thanksGroupTitles[i]; });
      qa('.thanks-tag').forEach(function (el, i) { if (zhCache.thanksTags[i] != null) el.textContent = zhCache.thanksTags[i]; });
      if (q('.thanks-group:last-child p')) q('.thanks-group:last-child p').innerHTML = zhCache.thanksCompanions;
      if (q('.companion-title')) q('.companion-title').innerHTML = zhCache.companionTitle;
      if (q('.companion-text')) q('.companion-text').innerHTML = zhCache.companionText;
      if (q('#sec2 h2.display')) q('#sec2 h2.display').innerHTML = zhCache.sec2Title;
      if (q('#sec2 > p.reveal')) q('#sec2 > p.reveal').innerHTML = zhCache.sec2P1;
      if (q('#sec2 .video-showcase figcaption')) q('#sec2 .video-showcase figcaption').innerHTML = zhCache.fig2Cap;
      if (q('.gallery-eyebrow')) q('.gallery-eyebrow').textContent = zhCache.galleryEyebrow;
      if (q('.gallery-title')) q('.gallery-title').textContent = zhCache.galleryTitle;
      qa('.gallery-tag').forEach(function (el, i) { if (zhCache.galleryTags[i] != null) el.textContent = zhCache.galleryTags[i]; });
      qa('.gallery-card-title').forEach(function (el, i) { if (zhCache.galleryCardTitles[i] != null) el.textContent = zhCache.galleryCardTitles[i]; });
      qa('.gallery-card-desc').forEach(function (el, i) { if (zhCache.galleryCardDescs[i] != null) el.textContent = zhCache.galleryCardDescs[i]; });
      if (q('#sec3 .subdisplay')) q('#sec3 .subdisplay').innerHTML = zhCache.sec3Title;
      qa('#sec3 > p.reveal').forEach(function (el, i) { if (zhCache.sec3Ps[i] != null) el.innerHTML = zhCache.sec3Ps[i]; });
      qa('#sec3 .dl-stack:first-of-type .dl .right').forEach(function (el, i) { if (zhCache.dlRights[i] != null) el.innerHTML = zhCache.dlRights[i]; });
      if (q('.dl-notes-title')) q('.dl-notes-title').textContent = zhCache.dlNotesTitle;
      if (q('.dl-notes-list')) q('.dl-notes-list').innerHTML = zhCache.dlNotesList;
      if (q('.dl-addon-head .os')) q('.dl-addon-head .os').textContent = zhCache.s1Title;
      if (q('.dl-addon-head .addon-price')) q('.dl-addon-head .addon-price').textContent = zhCache.s1Price;
      if (q('.dl-addon-head .right')) q('.dl-addon-head .right').innerHTML = zhCache.s1Right;
      qa('.addon-item h4').forEach(function (el, i) { if (zhCache.addonTitles[i] != null) el.innerHTML = zhCache.addonTitles[i]; });
      qa('.addon-item .addon-list').forEach(function (el, i) { if (zhCache.addonLists[i] != null) el.innerHTML = zhCache.addonLists[i]; });
      if (q('.addon-foot-name')) q('.addon-foot-name').textContent = zhCache.addonFootName;
      if (q('.addon-foot-badge')) q('.addon-foot-badge').textContent = zhCache.addonFootBadge;
      if (q('.addon-foot-desc')) q('.addon-foot-desc').textContent = zhCache.addonFootDesc;
      if (q('#sec4 h2.display')) q('#sec4 h2.display').innerHTML = zhCache.sec4Title;
      qa('#sec4 > p.reveal').forEach(function (el, i) { if (zhCache.sec4Ps[i] != null) el.innerHTML = zhCache.sec4Ps[i]; });
      if (q('.footer-title')) q('.footer-title').innerHTML = zhCache.footerTitle;
      if (q('.footer-mail-line span')) q('.footer-mail-line span').textContent = zhCache.footerMailLabel;
      qa('.footer-links-line a').forEach(function (el, i) {
        if (zhCache.footerLinks[i] == null) return;
        var span = el.querySelector('span:last-child');
        if (span) span.innerHTML = zhCache.footerLinks[i];
        else el.innerHTML = zhCache.footerLinks[i];
      });
    } else {
      document.title = EN_PAGE.title;
      qa('.nav-links a').forEach(function (el, i) { if (EN_PAGE.navLinks[i]) el.textContent = EN_PAGE.navLinks[i]; });
      if (q('#btn-toc-toggle span')) q('#btn-toc-toggle span').textContent = EN_PAGE.tocBtn;
      if (q('.btn-nav-cta')) q('.btn-nav-cta').textContent = EN_PAGE.ctaBtn;
      if (q('.side-note-text')) q('.side-note-text').innerHTML = EN_PAGE.sideNote;
      qa('.toc-item a span:last-child').forEach(function (el, i) { if (EN_PAGE.tocItems[i]) el.textContent = EN_PAGE.tocItems[i]; });
      if (q('.tagline')) q('.tagline').textContent = EN_PAGE.tagline;
      if (q('#sec1 h2.display')) q('#sec1 h2.display').textContent = EN_PAGE.sec1Title;
      var sec1Ps = qa('#sec1 > p.reveal');
      if (sec1Ps[0]) sec1Ps[0].innerHTML = EN_PAGE.sec1P1;
      if (sec1Ps[1]) sec1Ps[1].innerHTML = EN_PAGE.sec1P2;
      if (sec1Ps[2]) sec1Ps[2].innerHTML = EN_PAGE.sec1P3;
      if (sec1Ps[3]) sec1Ps[3].innerHTML = EN_PAGE.sec1P4;
      if (sec1Ps[4]) sec1Ps[4].textContent = EN_PAGE.dossierCap;
      if (sec1Ps[5]) sec1Ps[5].innerHTML = EN_PAGE.sec1P5;
      if (q('#fig-origin figcaption')) q('#fig-origin figcaption').innerHTML = EN_PAGE.fig1Cap;
      qa('#sec1 .matrix .cell p').forEach(function (el, i) { if (EN_PAGE.matrixLabels[i]) el.textContent = EN_PAGE.matrixLabels[i]; });
      if (q('.thanks-quote')) q('.thanks-quote').textContent = EN_PAGE.thanksQuote;
      qa('.thanks-group h4').forEach(function (el, i) { if (EN_PAGE.thanksGroupTitles[i]) el.innerHTML = EN_PAGE.thanksGroupTitles[i]; });
      qa('.thanks-tag').forEach(function (el, i) { if (EN_PAGE.thanksTags[i]) el.textContent = EN_PAGE.thanksTags[i]; });
      if (q('.thanks-group:last-child p')) q('.thanks-group:last-child p').innerHTML = EN_PAGE.thanksCompanions;
      if (q('.companion-title')) q('.companion-title').innerHTML = EN_PAGE.companionTitle;
      if (q('.companion-text')) q('.companion-text').innerHTML = EN_PAGE.companionText;
      if (q('#sec2 h2.display')) q('#sec2 h2.display').innerHTML = EN_PAGE.sec2Title;
      if (q('#sec2 > p.reveal')) q('#sec2 > p.reveal').innerHTML = EN_PAGE.sec2P1;
      if (q('#sec2 .video-showcase figcaption')) q('#sec2 .video-showcase figcaption').innerHTML = EN_PAGE.fig2Cap;
      if (q('.gallery-eyebrow')) q('.gallery-eyebrow').textContent = EN_PAGE.galleryEyebrow;
      if (q('.gallery-title')) q('.gallery-title').textContent = EN_PAGE.galleryTitle;
      qa('.gallery-tag').forEach(function (el, i) { if (EN_PAGE.galleryTags[i]) el.textContent = EN_PAGE.galleryTags[i]; });
      qa('.gallery-card-title').forEach(function (el, i) { if (EN_PAGE.galleryCardTitles[i]) el.textContent = EN_PAGE.galleryCardTitles[i]; });
      qa('.gallery-card-desc').forEach(function (el, i) { if (EN_PAGE.galleryCardDescs[i]) el.textContent = EN_PAGE.galleryCardDescs[i]; });
      if (q('#sec3 .subdisplay')) q('#sec3 .subdisplay').innerHTML = EN_PAGE.sec3Title;
      var sec3Ps = qa('#sec3 > p.reveal');
      if (sec3Ps[0]) sec3Ps[0].innerHTML = EN_PAGE.sec3P1;
      if (sec3Ps[1]) sec3Ps[1].innerHTML = EN_PAGE.sec3P2;
      var dlRights = qa('#sec3 .dl-stack:first-of-type .dl .right');
      if (dlRights[0]) {
        var svg0 = dlRights[0].querySelector('svg');
        dlRights[0].innerHTML = EN_PAGE.dlWinRight + (svg0 ? svg0.outerHTML : '');
      }
      if (dlRights[1]) dlRights[1].textContent = EN_PAGE.dlSoon;
      if (dlRights[2]) dlRights[2].textContent = EN_PAGE.dlSoon;
      if (q('.dl-notes-title')) q('.dl-notes-title').textContent = EN_PAGE.dlNotesTitle;
      if (q('.dl-notes-list')) q('.dl-notes-list').innerHTML = EN_PAGE.dlNotesList;
      if (q('.dl-addon-head .os')) q('.dl-addon-head .os').textContent = EN_PAGE.s1Title;
      if (q('.dl-addon-head .addon-price')) q('.dl-addon-head .addon-price').textContent = EN_PAGE.s1Price;
      if (q('.dl-addon-head .right')) {
        var svgS1 = q('.dl-addon-head .right svg');
        q('.dl-addon-head .right').innerHTML = EN_PAGE.s1Right + (svgS1 ? svgS1.outerHTML : '');
      }
      qa('.addon-item h4').forEach(function (el, i) { if (EN_PAGE.addonTitles[i]) el.innerHTML = EN_PAGE.addonTitles[i]; });
      qa('.addon-item .addon-list').forEach(function (el, i) { if (EN_PAGE.addonLists[i]) el.innerHTML = EN_PAGE.addonLists[i]; });
      if (q('.addon-foot-name')) q('.addon-foot-name').textContent = EN_PAGE.addonFootName;
      if (q('.addon-foot-badge')) q('.addon-foot-badge').textContent = EN_PAGE.addonFootBadge;
      if (q('.addon-foot-desc')) q('.addon-foot-desc').textContent = EN_PAGE.addonFootDesc;
      if (q('#sec4 h2.display')) q('#sec4 h2.display').innerHTML = EN_PAGE.sec4Title;
      var sec4Ps = qa('#sec4 > p.reveal');
      if (sec4Ps[0]) sec4Ps[0].innerHTML = EN_PAGE.sec4P1;
      if (sec4Ps[1]) sec4Ps[1].innerHTML = EN_PAGE.sec4P2;
      if (sec4Ps[2]) sec4Ps[2].innerHTML = EN_PAGE.sec4P3;
      if (q('.footer-title')) q('.footer-title').innerHTML = EN_PAGE.footerTitle;
      if (q('.footer-mail-line span')) q('.footer-mail-line span').textContent = EN_PAGE.footerMailLabel;
      qa('.footer-links-line a').forEach(function (el, i) {
        if (!EN_PAGE.footerLinks[i]) return;
        var span = el.querySelector('span:last-child');
        if (span) span.innerHTML = EN_PAGE.footerLinks[i];
        else el.innerHTML = EN_PAGE.footerLinks[i];
      });
    }

    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, currentLang); } catch (e) { }
    }
    window.dispatchEvent(new CustomEvent('neinote:langchange', { detail: { lang: currentLang } }));
  }

  function isMainlandChinaLocal() {
    var tz = '';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) { }
    var cnTz = tz === 'Asia/Shanghai' || tz === 'Asia/Chongqing' || tz === 'Asia/Harbin' || tz === 'Asia/Urumqi';
    var lang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    var isCnLang = lang === 'zh-cn' || lang === 'zh-hans-cn' || lang === 'zh-hans';
    return cnTz || isCnLang;
  }

  function detectCloudflareRegion(onResult) {
    if (typeof fetch !== 'function') return;
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 1500) : 0;
    fetch('/cdn-cgi/trace', controller ? { signal: controller.signal, cache: 'no-store' } : { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.text() : ''; })
      .then(function (txt) {
        if (timer) clearTimeout(timer);
        var m = txt && txt.match(/^loc=([A-Z]{2})/m);
        if (m && m[1]) {
          onResult(m[1] === 'CN' ? 'zh' : 'en');
        }
      })
      .catch(function () {
        if (timer) clearTimeout(timer);
      });
  }

  function init() {
    captureZh();
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { }
    if (saved === 'en' || saved === 'zh') {
      applyLang(saved, false);
    } else {
      var initial = isMainlandChinaLocal() ? 'zh' : 'en';
      if (initial === 'en') applyLang('en', false);
      detectCloudflareRegion(function (detected) {
        var userSaved = null;
        try { userSaved = localStorage.getItem(STORAGE_KEY); } catch (e) { }
        if (!userSaved && detected !== currentLang) {
          applyLang(detected, false);
        }
      });
    }
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        applyLang(currentLang === 'zh' ? 'en' : 'zh', true);
      });
    }
  }

  window.NeinoteI18n = {
    getLang: function () { return currentLang; },
    setLang: applyLang
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


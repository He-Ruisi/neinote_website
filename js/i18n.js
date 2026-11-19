/* =========================================================
   Neinote 中英文双语适配模块 (zh / en) - 控制调度引擎
   数据字典已拆分至 js/i18n-en.js，实现数据与视图逻辑解耦
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'neinote_lang';
  var currentLang = 'zh';
  var zhCache = null;
  var EN_PAGE = window.EN_PAGE || {};

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
      previewEyebrow: q('.preview-eyebrow') ? q('.preview-eyebrow').textContent : '',
      previewTitle: q('.preview-title') ? q('.preview-title').textContent : '',
      previewSubtitle: q('.preview-subtitle') ? q('.preview-subtitle').textContent : '',
      previewTags: qa('.preview-tag').map(function (el) { return el.textContent; }),
      previewCardTitles: qa('.preview-card-title').map(function (el) { return el.textContent; }),
      previewCardDescs: qa('.preview-card-desc').map(function (el) { return el.textContent; }),
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
      if (q('.preview-eyebrow')) q('.preview-eyebrow').textContent = zhCache.previewEyebrow;
      if (q('.preview-title')) q('.preview-title').textContent = zhCache.previewTitle;
      if (q('.preview-subtitle')) q('.preview-subtitle').textContent = zhCache.previewSubtitle;
      qa('.preview-tag').forEach(function (el, i) { if (zhCache.previewTags[i] != null) el.textContent = zhCache.previewTags[i]; });
      qa('.preview-card-title').forEach(function (el, i) { if (zhCache.previewCardTitles[i] != null) el.textContent = zhCache.previewCardTitles[i]; });
      qa('.preview-card-desc').forEach(function (el, i) { if (zhCache.previewCardDescs[i] != null) el.textContent = zhCache.previewCardDescs[i]; });
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
      if (q('.preview-eyebrow')) q('.preview-eyebrow').textContent = EN_PAGE.previewEyebrow;
      if (q('.preview-title')) q('.preview-title').textContent = EN_PAGE.previewTitle;
      if (q('.preview-subtitle')) q('.preview-subtitle').textContent = EN_PAGE.previewSubtitle;
      qa('.preview-tag').forEach(function (el, i) { if (EN_PAGE.previewTags[i]) el.textContent = EN_PAGE.previewTags[i]; });
      qa('.preview-card-title').forEach(function (el, i) { if (EN_PAGE.previewCardTitles[i]) el.textContent = EN_PAGE.previewCardTitles[i]; });
      qa('.preview-card-desc').forEach(function (el, i) { if (EN_PAGE.previewCardDescs[i]) el.textContent = EN_PAGE.previewCardDescs[i]; });
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


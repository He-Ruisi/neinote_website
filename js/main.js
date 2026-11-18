(function () {
  "use strict";
  var root = document.documentElement;
  root.className = 'js';

  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var essay = document.getElementById('essay');
  var railWrap = document.getElementById('rail-wrap');
  var svg = document.getElementById('rail');
  var marker = document.querySelector('.scroll-mark');

  var railPath = null, railLen = 0, marks = [];
  var drawP = reduce ? 1 : 0, drawTarget = reduce ? 1 : 0;
  var markPos = 0, markTarget = 0;

  /* 缓存几何尺寸，避免帧循环触发强制回流 */
  var essayH = 1, docMaxScroll = 1, vh = window.innerHeight;
  var railW = 96, railCenter = 48, railAmp = 14;
  var rafId = null;

  function pathX(y) {
    return railCenter + Math.sin(y * 0.011) * railAmp;
  }

  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    }
    return e;
  }

  function measure() {
    vh = window.innerHeight;
    essayH = Math.max(essay.offsetHeight, vh);
    docMaxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    railW = (railWrap && railWrap.clientWidth) ? railWrap.clientWidth : 112;
    if (railW <= 56) {
      railCenter = 20;
      railAmp = 5;
    } else {
      railCenter = 40;
      railAmp = 10;
    }
  }

  /* ---------- 构建左侧自适应枝干 ---------- */
  function buildRail() {
    if (!svg) return;
    measure();
    var isCompact = railW <= 56;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    while (svg.firstChild) svg.removeChild(svg.firstChild);
    marks = [];

    svg.setAttribute('viewBox', '0 0 ' + railW + ' ' + essayH);
    svg.setAttribute('width', railW);
    svg.setAttribute('height', essayH);

    /* 主枝曲线 */
    var d = 'M ' + pathX(0).toFixed(2) + ' 0';
    for (var y = 60; y <= essayH; y += 60) {
      var py = y - 60, cy = py + 30;
      d += ' C ' + pathX(py).toFixed(2) + ' ' + cy + ', ' + pathX(y).toFixed(2) + ' ' + cy + ', ' + pathX(y).toFixed(2) + ' ' + y;
    }
    railPath = el('path', { 'd': d, 'class': 'rail-path' });
    svg.appendChild(railPath);
    railLen = railPath.getTotalLength();
    railPath.style.strokeDasharray = railLen;
    railPath.style.strokeDashoffset = reduce ? 0 : (railLen * (1 - drawP));

    /* 收集正文中的段落标记（排除隐藏抽屉与页脚） */
    var secs = document.querySelectorAll('#essay main .sec');
    for (var i = 0; i < secs.length; i++) {
      var lab = secs[i].querySelector('.sec-label');
      if (!lab) continue;
      var top = lab.getBoundingClientRect().top + scrollTop;
      marks.push({
        y: Math.round(top),
        type: 'sec',
        num: ('0' + (i + 1)).slice(-2),
        secId: secs[i].id
      });
    }

    /* 仅收集正文内的抽屉链接 */
    var links = document.querySelectorAll('#essay main a[data-drawer]');
    for (var j = 0; j < links.length; j++) {
      var r = links[j].getBoundingClientRect();
      if (r.height === 0) continue;
      marks.push({
        y: Math.round(r.top + scrollTop + r.height / 2),
        type: 'link',
        target: links[j].getAttribute('data-drawer'),
        label: links[j].textContent.trim()
      });
    }
    marks.sort(function (a, b) { return a.y - b.y; });

    /* 段落间隙 + 序号 */
    for (var m = 0; m < marks.length; m++) {
      if (marks[m].type !== 'sec') continue;
      var y0 = marks[m].y, px = pathX(y0);
      var gapSize = isCompact ? 14 : 22;
      svg.appendChild(el('rect', {
        x: (px - gapSize / 2).toFixed(2),
        y: y0 - gapSize / 2,
        width: gapSize,
        height: gapSize,
        'class': 'rail-gap'
      }));
      if (!isCompact) {
        var t = el('text', { x: (px + 12).toFixed(2), y: y0 + 18, 'class': 'rail-num' });
        t.textContent = '§ ' + marks[m].num;
        svg.appendChild(t);
      }
    }

    /* 生成叶子，若纵坐标接近则自然错开角度 */
    var lastLinkY = -999;
    for (var n = 0; n < marks.length; n++) {
      var mk = marks[n];
      var isSec = mk.type === 'sec';
      var angle = -15;
      if (!isSec) {
        if (mk.y - lastLinkY < 22) {
          angle = (n % 2 === 0) ? -32 : 8;
        }
        lastLinkY = mk.y;
      }

      var stem = isCompact ? (isSec ? 10 : 8) : (isSec ? 16 : 12);
      var len = isCompact ? (isSec ? 10 : 7) : (isSec ? 15 : 11);
      var g = el('g', {
        'class': 'leaf ' + (isSec ? 'leaf-sec' : 'leaf-link'),
        transform: 'translate(' + pathX(mk.y).toFixed(2) + ',' + mk.y + ') rotate(' + angle + ')'
      });

      var isEn = document.documentElement.lang === 'en';
      if (mk.target) {
        g.setAttribute('data-target', mk.target);
        g.setAttribute('data-action', 'drawer');
        var tip1 = el('title', {});
        tip1.textContent = (isEn ? 'Open: ' : '打开：') + mk.label;
        g.appendChild(tip1);
      } else if (mk.secId) {
        g.setAttribute('data-sec', mk.secId);
        g.setAttribute('data-action', 'scroll');
        var tip2 = el('title', {});
        tip2.textContent = (isEn ? 'Jump to § ' : '跳转至 § ') + mk.num;
        g.appendChild(tip2);
      }

      var inner = el('g', { 'class': 'leaf-in' });
      inner.appendChild(el('line', { x1: 0, y1: 0, x2: stem, y2: 0 }));
      inner.appendChild(el('path', {
        d: 'M ' + stem + ' 0 Q ' + (stem + len * 0.5) + ' ' + (-len * 0.38) + ' ' + (stem + len) + ' 0 Q ' + (stem + len * 0.5) + ' ' + (len * 0.38) + ' ' + stem + ' 0 Z'
      }));
      /* 隐形点击热区 */
      g.appendChild(el('circle', { 'class': 'hit', cx: stem * 0.7, cy: 0, r: isCompact ? 12 : 16 }));
      g.appendChild(inner);
      g.appendChild(el('circle', { 'class': 'halo', cx: 0, cy: 0, r: 11 }));
      svg.appendChild(g);
      marks[n].node = g;
    }

    updateImmediate();
  }

  /* ---------- 按需驱动的滚动动画 ---------- */
  function updateImmediate() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    drawTarget = reduce ? 1 : Math.min(1, Math.max(0, (scrollY + vh * 0.9) / essayH));
    markTarget = vh * 0.20 + Math.min(1, scrollY / docMaxScroll) * vh * 0.60;

    if (reduce) {
      drawP = 1;
      markPos = markTarget;
      applyVisuals();
      return;
    }
    scheduleFrame();
  }

  function applyVisuals() {
    if (railPath && !reduce) {
      railPath.style.strokeDashoffset = (railLen * (1 - drawP)).toFixed(2);
    }
    var drawnY = drawP * essayH;
    for (var i = 0; i < marks.length; i++) {
      if (marks[i].node && !marks[i].node.classList.contains('on') && (reduce || marks[i].y <= drawnY)) {
        marks[i].node.classList.add('on');
      }
    }
    if (marker) {
      marker.style.transform = 'translate3d(0,' + markPos.toFixed(1) + 'px,0)';
    }
  }

  function onFrame() {
    rafId = null;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    drawTarget = Math.min(1, Math.max(0, (scrollY + vh * 0.9) / essayH));
    markTarget = vh * 0.20 + Math.min(1, scrollY / docMaxScroll) * vh * 0.60;

    var dDiff = drawTarget - drawP;
    var mDiff = markTarget - markPos;

    if (Math.abs(dDiff) < 0.0005 && Math.abs(mDiff) < 0.2) {
      drawP = drawTarget;
      markPos = markTarget;
      applyVisuals();
      return; /* 已收敛，停止 rAF */
    }

    drawP += dDiff * 0.2;
    markPos += mDiff * 0.2;
    applyVisuals();
    scheduleFrame();
  }

  function scheduleFrame() {
    if (!rafId && !reduce) {
      rafId = requestAnimationFrame(onFrame);
    }
  }

  window.addEventListener('scroll', scheduleFrame, { passive: true });

  /* ---------- 入场动效 ---------- */
  function setupReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  /* ---------- FIG.01 图片稳态处理 ---------- */
  function setupPhoto() {
    var fig = document.getElementById('fig-origin');
    if (!fig) return;
    var img = fig.querySelector('img');
    var wrap = fig.querySelector('.photo-wrap');
    if (!img || !wrap) return;
    img.addEventListener('load', function () {
      setTimeout(buildRail, 60);
    });
    img.addEventListener('error', function () {
      wrap.remove();
      buildRail();
    });
  }

  /* ---------- FIG.02 Twiggo 交互示意 ---------- */
  function setupTwiggoDemo() {
    var demo = document.getElementById('twiggo-demo');
    if (!demo) return;
    var body = demo.querySelector('.shot-body');
    var addBtn = document.getElementById('demo-add');
    if (!body) return;

    function refreshToggles() {
      var nodes = body.querySelectorAll('.node[data-lv]');
      for (var i = 0; i < nodes.length; i++) {
        var lv = parseInt(nodes[i].getAttribute('data-lv'), 10);
        var next = nodes[i].nextElementSibling;
        var hasChild = next && next.hasAttribute('data-lv') && parseInt(next.getAttribute('data-lv'), 10) > lv;
        if (hasChild) {
          nodes[i].setAttribute('data-toggle', '1');
        } else {
          nodes[i].removeAttribute('data-toggle');
        }
      }
    }
    refreshToggles();

    body.addEventListener('click', function (ev) {
      var node = ev.target.closest ? ev.target.closest('.node[data-toggle]') : null;
      if (node) {
        var lv = parseInt(node.getAttribute('data-lv'), 10);
        var collapsed = node.classList.toggle('collapsed');
        var cur = node.nextElementSibling;
        var hideDepth = 999;
        while (cur && cur.hasAttribute('data-lv')) {
          var curLv = parseInt(cur.getAttribute('data-lv'), 10);
          if (curLv <= lv) break;
          if (collapsed) {
            cur.classList.add('hidden-node');
          } else {
            if (curLv <= hideDepth) {
              cur.classList.remove('hidden-node');
              hideDepth = cur.classList.contains('collapsed') ? curLv : 999;
            }
          }
          cur = cur.nextElementSibling;
        }
        buildRail();
        return;
      }

      if (addBtn && (ev.target === addBtn || addBtn.contains(ev.target))) {
        if (body.querySelector('.node-input-wrap')) return;
        var wrap = document.createElement('div');
        wrap.className = 'node-input-wrap';
        wrap.innerHTML = '<i></i><input type="text" class="node-input" placeholder="输入一闪而过的念头，回车记录…" maxlength="60">';
        body.insertBefore(wrap, addBtn);
        var inp = wrap.querySelector('input');
        inp.focus();

        function commit() {
          var val = inp.value.trim();
          wrap.remove();
          if (val) {
            var item = document.createElement('div');
            item.className = 'node lv1';
            item.setAttribute('data-lv', '1');
            item.innerHTML = '<i></i>';
            item.appendChild(document.createTextNode(val));
            body.insertBefore(item, addBtn);
            refreshToggles();
            buildRail();
          }
        }
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { wrap.remove(); }
        });
        inp.addEventListener('blur', commit);
      }
    });
  }

  /* ---------- 抽屉 ---------- */
  var drawer = document.getElementById('drawer');
  var backdrop = document.getElementById('backdrop');
  var dTitle = document.getElementById('drawer-title');
  var dEye = document.getElementById('drawer-eyebrow');
  var dBody = document.getElementById('drawer-body');
  var currentId = null, lastFocus = null;

  function setHot(id, on, pulse) {
    var leaves = document.querySelectorAll('.leaf[data-target="' + id + '"]');
    for (var i = 0; i < leaves.length; i++) {
      leaves[i].classList.toggle('hot', on);
      if (on && pulse) {
        leaves[i].classList.remove('pulse');
        void leaves[i].getBoundingClientRect();
        leaves[i].classList.add('pulse');
      }
    }
  }

  function getPanelData(id) {
    var isEn = document.documentElement.lang === 'en';
    if (isEn && window.DRAWER_PANELS_EN && window.DRAWER_PANELS_EN[id]) {
      return window.DRAWER_PANELS_EN[id];
    }
    if (window.DRAWER_PANELS && window.DRAWER_PANELS[id]) {
      return window.DRAWER_PANELS[id];
    }
    var p = document.getElementById(id);
    if (p && p.classList.contains('panel')) {
      return {
        title: p.getAttribute('data-title') || id,
        eyebrow: p.getAttribute('data-eyebrow') || 'DRAWER',
        html: p.innerHTML
      };
    }
    return null;
  }

  function openDrawer(id, push) {
    var data = getPanelData(id);
    if (!data) return;
    if (currentId && currentId !== id) setHot(currentId, false, false);
    dTitle.textContent = data.title || id;
    dEye.textContent = data.eyebrow || 'DRAWER';
    dBody.innerHTML = data.html;
    if (!drawer.classList.contains('open')) lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('on');
    document.body.classList.add('locked');
    currentId = id;
    setHot(id, true, true);
    try { drawer.scrollTop = 0; } catch (e) { }
    setTimeout(function () { dTitle.focus(); }, 80);
    if (push && window.history && history.pushState) {
      history.pushState({ drawer: id }, '', '#' + id);
    }
  }

  function closeNow() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('on');
    document.body.classList.remove('locked');
    if (currentId) setHot(currentId, false, false);
    currentId = null;
    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus(); } catch (e) { }
    }
    lastFocus = null;
  }

  function requestClose() {
    if (window.history && history.state && history.state.drawer) {
      history.back();
    } else {
      if (location.hash && window.history && history.replaceState) {
        history.replaceState(null, '', location.pathname + location.search);
      }
      closeNow();
    }
  }

  document.addEventListener('click', function (ev) {
    /* 复制邮箱 */
    var copyBtn = ev.target.closest ? ev.target.closest('[data-copy]') : null;
    if (copyBtn) {
      var text = copyBtn.getAttribute('data-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          var orig = copyBtn.textContent;
          copyBtn.textContent = document.documentElement.lang === 'en' ? 'Copied' : '已复制';
          setTimeout(function () { copyBtn.textContent = orig; }, 1600);
        });
      }
      return;
    }

    /* 点击抽屉链接 */
    var a = ev.target.closest ? ev.target.closest('a[data-drawer]') : null;
    if (a) {
      ev.preventDefault();
      openDrawer(a.getAttribute('data-drawer'), true);
      return;
    }

    /* 点击 Creem 结账按钮（支持抽屉内动态渲染） */
    var cBtn = ev.target.closest ? ev.target.closest('[data-creem-checkout]') : null;
    if (cBtn && window.Creem && typeof window.Creem.openCheckout === 'function') {
      var cUrl = cBtn.getAttribute('data-creem-url') || cBtn.getAttribute('href');
      if (cUrl) {
        ev.preventDefault();
        window.Creem.openCheckout({
          checkoutUrl: cUrl,
          theme: cBtn.getAttribute('data-creem-theme') || 'light',
          locale: cBtn.getAttribute('data-creem-locale') || (document.documentElement.lang === 'en' ? 'en' : 'zh')
        });
        return;
      }
    }

    /* 点击枝干叶子 */
    var leaf = ev.target.closest ? ev.target.closest('.leaf[data-action]') : null;
    if (leaf) {
      var act = leaf.getAttribute('data-action');
      if (act === 'drawer') {
        openDrawer(leaf.getAttribute('data-target'), true);
      } else if (act === 'scroll') {
        var sec = document.getElementById(leaf.getAttribute('data-sec'));
        if (sec) sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      }
      return;
    }

    if (ev.target.closest && ev.target.closest('#drawer-close')) {
      requestClose();
    }
  });

  backdrop.addEventListener('click', requestClose);

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && drawer.classList.contains('open')) requestClose();
    if (ev.key === 'Tab' && drawer.classList.contains('open')) {
      var f = drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && (document.activeElement === first || document.activeElement === dTitle)) {
        ev.preventDefault();
        last.focus();
      } else if (!ev.shiftKey && document.activeElement === last) {
        ev.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('popstate', function () {
    var id = location.hash ? location.hash.slice(1) : '';
    if (id && getPanelData(id)) {
      openDrawer(id, false);
    } else {
      closeNow();
    }
  });

  /* ---------- 1. 主题切换与持久化 ---------- */
  function setupTheme() {
    var themeToggle = document.getElementById('theme-toggle');
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem('neinote_theme');
    } catch (e) { }

    if (savedTheme === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var isLight = root.getAttribute('data-theme') === 'light';
        var nextTheme = isLight ? 'dark' : 'light';
        if (nextTheme === 'light') {
          root.setAttribute('data-theme', 'light');
        } else {
          root.removeAttribute('data-theme');
        }
        try {
          localStorage.setItem('neinote_theme', nextTheme);
        } catch (e) { }
        buildRail();
      });
    }
  }

  /* ---------- 2. 网页化导航栏滚动状态与 TOC 目录系统 ---------- */
  function setupNavAndTOC() {
    var nav = document.getElementById('site-nav');
    var tocPanel = document.getElementById('toc-panel');
    var tocToggle = document.getElementById('btn-toc-toggle');
    var tocClose = document.getElementById('toc-close');
    var tocItems = document.querySelectorAll('.toc-item');
    var trackedSections = [];

    var tocLinks = document.querySelectorAll('.toc-list a');
    for (var k = 0; k < tocLinks.length; k++) {
      var href = tocLinks[k].getAttribute('href');
      if (href && href.charAt(0) === '#') {
        var targetEl = document.getElementById(href.slice(1));
        if (targetEl) {
          trackedSections.push({
            id: href.slice(1),
            el: targetEl,
            tocItem: tocLinks[k].closest('.toc-item')
          });
        }
      }
    }

    function syncTocState(isCollapsed) {
      if (!tocPanel) return;
      tocPanel.classList.toggle('collapsed', isCollapsed);
      document.body.classList.toggle('toc-collapsed', isCollapsed);
      if (tocToggle) tocToggle.classList.toggle('active', !isCollapsed);
    }

    if (window.innerWidth <= 1024 && tocPanel) {
      syncTocState(true);
    }

    if (tocToggle && tocPanel) {
      tocToggle.addEventListener('click', function () {
        var isCollapsed = !tocPanel.classList.contains('collapsed');
        syncTocState(isCollapsed);
        setTimeout(buildRail, 300);
      });
    }
    if (tocClose && tocPanel && tocToggle) {
      tocClose.addEventListener('click', function () {
        syncTocState(true);
        setTimeout(buildRail, 300);
      });
    }

    var smoothLinks = document.querySelectorAll('.toc-item a, .nav-links a');
    for (var l = 0; l < smoothLinks.length; l++) {
      smoothLinks[l].addEventListener('click', function (e) {
        var h = this.getAttribute('href');
        if (h && h.charAt(0) === '#' && h.length > 1) {
          var t = document.getElementById(h.slice(1));
          if (t) {
            e.preventDefault();
            var topOffset = t.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 72;
            window.scrollTo({
              top: Math.max(0, topOffset),
              behavior: reduce ? 'auto' : 'smooth'
            });
            if (window.innerWidth <= 1024 && tocPanel) {
              syncTocState(true);
            }
          }
        }
      });
    }

    function onScrollSpy() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (nav) {
        if (scrollY > 20) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }

      var probe = scrollY + 160;
      var activeItem = null;
      for (var m = 0; m < trackedSections.length; m++) {
        var rectTop = trackedSections[m].el.offsetTop;
        if (probe >= rectTop) {
          activeItem = trackedSections[m].tocItem;
        }
      }
      if (!activeItem && trackedSections.length > 0) {
        activeItem = trackedSections[0].tocItem;
      }
      for (var n = 0; n < tocItems.length; n++) {
        tocItems[n].classList.remove('active');
      }
      if (activeItem) {
        activeItem.classList.add('active');
      }
    }

    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy();
  }

  /* ---------- 首屏 Gooey 液态文字切换 ---------- */
  function setupGooeyWordmark() {
    if (reduce) return;
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
    var rafId = 0;
    var timerId = 0;
    var DURATION = 4700;
    var HOLD = 1600;
    var STD_PEAK = 5.2;

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
          rafId = requestAnimationFrame(frame);
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
      rafId = requestAnimationFrame(frame);
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
    host.addEventListener('click', function () {
      clearTimeout(timerId);
      morphNext();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearTimeout(timerId);
        if (rafId) cancelAnimationFrame(rafId);
        if (morphing) {
          blurEl.setAttribute('stdDeviation', '0');
          group.style.filter = 'none';
          active.setAttribute('opacity', '0');
          active.removeAttribute('transform');
          standby.setAttribute('opacity', '1');
          standby.removeAttribute('transform');
          var tmp = active;
          active = standby;
          standby = tmp;
          idx = (idx + 1) % words.length;
          morphing = false;
        }
      } else {
        scheduleNext();
      }
    });

    scheduleNext();
  }

  /* ---------- 致谢名单展开/收起与 /thanks 直达 ---------- */
  function setupThanksBox() {
    var box = document.getElementById('thanks');
    var trigger = document.getElementById('thanks-trigger');
    var body = document.getElementById('thanks-body');
    var actionText = box ? box.querySelector('.thanks-action-text') : null;
    if (!box || !trigger || !body) return;

    function updateActionText(open) {
      var isEn = document.documentElement.lang === 'en';
      if (actionText) {
        actionText.textContent = open
          ? (isEn ? 'Hide list' : '收起名单')
          : (isEn ? 'Show list' : '展开名单');
      }
    }

    function setOpen(open, scrollInto) {
      box.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.setAttribute('aria-hidden', open ? 'false' : 'true');
      updateActionText(open);
      if (scrollInto) {
        setTimeout(function () {
          var top = box.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 100;
          window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
        }, 120);
      }
    }

    window.addEventListener('neinote:langchange', function () {
      updateActionText(box.classList.contains('is-open'));
      buildRail();
      if (currentId) openDrawer(currentId, false);
    });

    trigger.addEventListener('click', function () {
      var next = !box.classList.contains('is-open');
      setOpen(next, false);
      if (window.history && history.replaceState) {
        history.replaceState(null, '', next ? '#thanks' : location.pathname + location.search);
      }
    });

    function checkRoute() {
      var isThanksPath = /\/thanks\/?$/i.test(location.pathname);
      if (location.hash === '#thanks' || isThanksPath) {
        setOpen(true, true);
      }
    }

    window.addEventListener('hashchange', checkRoute);
    checkRoute();
  }

  /* ---------- 初始化 ---------- */
  function init() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    vh = window.innerHeight;
    docMaxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    markPos = vh * 0.20 + Math.min(1, scrollY / docMaxScroll) * vh * 0.60;

    setupTheme();
    setupNavAndTOC();
    setupGooeyWordmark();
    setupThanksBox();
    buildRail();
    setupReveal();
    setupPhoto();
    setupTwiggoDemo();

    var id = location.hash ? location.hash.slice(1) : '';
    if (id && getPanelData(id)) {
      openDrawer(id, false);
    }
  }

  var rt = null;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      var keep = currentId;
      buildRail();
      if (keep) setHot(keep, true, false);
    }, 160);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', function () {
    setTimeout(buildRail, 100);
  });
})();


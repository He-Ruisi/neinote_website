/* =========================================================
   ParticleShapeMorph — 3D 粒子形态变换组件（纯原生 JS Port）
   6 种几何形态：sphere / torus / helix / knot / cube / wave
   ========================================================= */
(function () {
  'use strict';

  var DEFAULT_SHAPES = ['sphere', 'torus', 'helix', 'knot', 'cube', 'wave'];
  var LABELS = {
    sphere: 'Lattice sphere',
    torus: 'Torus',
    helix: 'Double helix',
    knot: 'Trefoil knot',
    cube: 'Cube lattice',
    wave: 'Wave grid'
  };

  var TAU = Math.PI * 2;
  var GOLDEN = Math.PI * (3 - Math.sqrt(5));
  var STAGGER = 0.45;
  var BOW = 0.15;
  var FOV = 5;
  var FIT = 0.345;
  var DEPTH_STEPS = 8;

  function buildSphere(out, n) {
    for (var i = 0; i < n; i++) {
      var y = 1 - (2 * i + 1) / n;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var a = i * GOLDEN;
      out[i * 3] = Math.cos(a) * r;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = Math.sin(a) * r;
    }
  }

  function buildTorus(out, n) {
    var R = 0.79;
    var r = 0.2;
    var nv = Math.max(6, Math.round(Math.sqrt((n * r) / R)));
    var nu = Math.max(8, Math.floor(n / nv));
    var grid = nu * nv;
    for (var i = 0; i < n; i++) {
      var u, v;
      if (i < grid) {
        var a = Math.floor(i / nv);
        u = (a / nu) * TAU;
        v = ((i - a * nv + (a % 2) * 0.5) / nv) * TAU;
      } else {
        u = ((i - grid) / (n - grid)) * TAU;
        v = 0;
      }
      var rad = R + r * Math.cos(v);
      out[i * 3] = rad * Math.cos(u);
      out[i * 3 + 1] = r * Math.sin(v);
      out[i * 3 + 2] = rad * Math.sin(u);
    }
  }

  function buildHelix(out, n) {
    var TURNS = 2.2;
    var RAD = 0.62;
    var H = 1;
    var BARS = 13;
    var strand = Math.floor(n * 0.34);
    var rungs = n - strand * 2;
    var perBar = Math.max(1, Math.floor(rungs / BARS));

    function place(i, t, phase, mix) {
      var y = -H + 2 * H * t;
      var a = t * TURNS * TAU + phase;
      var x = RAD * Math.cos(a);
      var z = RAD * Math.sin(a);
      out[i * 3] = x - 2 * x * mix;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = z - 2 * z * mix;
    }

    for (var i = 0; i < strand; i++) place(i, i / (strand - 1 || 1), 0, 0);
    for (var k = 0; k < strand; k++) place(strand + k, k / (strand - 1 || 1), 0, 1);
    for (var j = 0; j < rungs; j++) {
      var bar = Math.min(BARS - 1, Math.floor(j / perBar));
      var inner = j - bar * perBar;
      place(2 * strand + j, (bar + 0.5) / BARS, 0, (inner + 1) / (perBar + 1));
    }
  }

  function buildKnot(out, n) {
    var TUBE = 0.34;
    function centre(t, p) {
      p[0] = Math.sin(t) + 2 * Math.sin(2 * t);
      p[1] = Math.cos(t) - 2 * Math.cos(2 * t);
      p[2] = -Math.sin(3 * t);
    }
    var ring = Math.max(5, Math.round(Math.sqrt(n / 7)));
    var stations = Math.max(8, Math.ceil(n / ring));
    var here = new Float32Array(3);
    var next = new Float32Array(3);
    var tan = new Float32Array(3);
    var nrm = new Float32Array(3);
    var bin = new Float32Array(3);
    var station = -1;

    for (var i = 0; i < n; i++) {
      var a = Math.floor(i / ring);
      if (a !== station) {
        station = a;
        var t = (a / stations) * TAU;
        centre(t, here);
        centre(t + 1e-3, next);
        var len = Math.hypot(next[0] - here[0], next[1] - here[1], next[2] - here[2]) || 1;
        for (var k = 0; k < 3; k++) tan[k] = (next[k] - here[k]) / len;
        var up = Math.abs(tan[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
        nrm[0] = tan[1] * up[2] - tan[2] * up[1];
        nrm[1] = tan[2] * up[0] - tan[0] * up[2];
        nrm[2] = tan[0] * up[1] - tan[1] * up[0];
        len = Math.hypot(nrm[0], nrm[1], nrm[2]) || 1;
        for (var m = 0; m < 3; m++) nrm[m] /= len;
        bin[0] = tan[1] * nrm[2] - tan[2] * nrm[1];
        bin[1] = tan[2] * nrm[0] - tan[0] * nrm[2];
        bin[2] = tan[0] * nrm[1] - tan[1] * nrm[0];
      }
      var v = ((i - a * ring + (a % 2) * 0.5) / ring) * TAU;
      var cs = Math.cos(v) * TUBE;
      var sn = Math.sin(v) * TUBE;
      for (var d = 0; d < 3; d++) {
        out[i * 3 + d] = here[d] + nrm[d] * cs + bin[d] * sn;
      }
    }
  }

  function buildCube(out, n) {
    var faceBudget = Math.round(n * 0.82);
    var side = Math.max(2, Math.round(Math.sqrt(faceBudget / 6)));
    var grid = side * side * 6;
    var edgePoints = n - grid;

    function write(i, p) {
      out[i * 3] = p[0];
      out[i * 3 + 1] = p[1];
      out[i * 3 + 2] = p[2];
    }

    for (var i = 0; i < grid; i++) {
      var face = Math.floor(i / (side * side));
      var cell = i - face * side * side;
      var u = ((Math.floor(cell / side) + 0.5) / side) * 2 - 1;
      var v = (((cell % side) + 0.5) / side) * 2 - 1;
      var axis = face >> 1;
      var s = face & 1 ? -1 : 1;
      write(i, axis === 0 ? [s, u, v] : axis === 1 ? [u, s, v] : [u, v, s]);
    }

    var perEdge = Math.max(1, Math.ceil(edgePoints / 12));
    for (var j = 0; j < edgePoints; j++) {
      var e = j % 12;
      var t = ((Math.floor(j / 12) + 0.5) / perEdge) * 2 - 1;
      var ax = Math.floor(e / 4);
      var a = e & 1 ? -1 : 1;
      var b = e & 2 ? -1 : 1;
      write(grid + j, ax === 0 ? [t, a, b] : ax === 1 ? [a, t, b] : [a, b, t]);
    }
  }

  function buildWave(out, n) {
    var side = Math.max(2, Math.floor(Math.sqrt(n)));
    var grid = side * side;
    function height(u, v) {
      return (
        0.34 * Math.sin(u * Math.PI * 1.5 + v * Math.PI * 0.55) +
        0.12 * Math.sin(v * Math.PI * 2.2)
      );
    }
    for (var i = 0; i < n; i++) {
      var u, v;
      if (i < grid) {
        u = ((Math.floor(i / side) + 0.5) / side) * 2 - 1;
        v = (((i % side) + 0.5) / side) * 2 - 1;
      } else {
        var t = ((i - grid) / (n - grid)) * 4;
        var leg = Math.floor(t);
        var s = (t - leg) * 2 - 1;
        u = leg === 0 ? s : leg === 1 ? 1 : leg === 2 ? -s : -1;
        v = leg === 0 ? -1 : leg === 1 ? s : leg === 2 ? 1 : -s;
      }
      out[i * 3] = u;
      out[i * 3 + 1] = height(u, v);
      out[i * 3 + 2] = v;
    }
  }

  var BUILDERS = {
    sphere: buildSphere,
    torus: buildTorus,
    helix: buildHelix,
    knot: buildKnot,
    cube: buildCube,
    wave: buildWave
  };

  function normalize(p, n) {
    var lo = [Infinity, Infinity, Infinity];
    var hi = [-Infinity, -Infinity, -Infinity];
    for (var i = 0; i < n * 3; i++) {
      var a = i % 3;
      if (p[i] < lo[a]) lo[a] = p[i];
      if (p[i] > hi[a]) hi[a] = p[i];
    }
    var mid = [
      (lo[0] + hi[0]) / 2,
      (lo[1] + hi[1]) / 2,
      (lo[2] + hi[2]) / 2
    ];
    var half = Math.max(
      (hi[0] - lo[0]) / 2,
      (hi[1] - lo[1]) / 2,
      (hi[2] - lo[2]) / 2,
      1e-6
    );
    var k = 0.95 / half;
    for (var j = 0; j < n * 3; j++) {
      p[j] = (p[j] - mid[j % 3]) * k;
    }
  }

  function sortByBearing(p, n) {
    var SECTORS = 48;
    var order = new Array(n);
    var key = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      order[i] = i;
      var bearing = (Math.atan2(p[i * 3 + 2], p[i * 3]) + Math.PI) / TAU;
      key[i] = Math.floor(bearing * SECTORS) * 4 + (p[i * 3 + 1] + 1);
    }
    order.sort(function (a, b) {
      return key[a] - key[b];
    });
    var sorted = new Float32Array(n * 3);
    for (var j = 0; j < n; j++) {
      sorted[j * 3] = p[order[j] * 3];
      sorted[j * 3 + 1] = p[order[j] * 3 + 1];
      sorted[j * 3 + 2] = p[order[j] * 3 + 2];
    }
    return sorted;
  }

  function buildShape(name, n) {
    var data = new Float32Array(n * 3);
    (BUILDERS[name] || buildSphere)(data, n);
    normalize(data, n);
    return sortByBearing(data, n);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function mountParticleMorph(host) {
    if (!host) return;
    var canvas = host.querySelector('canvas');
    var labelIdx = host.querySelector('.particle-idx');
    var labelName = host.querySelector('.particle-name');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var list = DEFAULT_SHAPES.slice();
    var n = 1200;
    var span = 1.25;
    var forms = list.map(function (name) {
      return buildShape(name, n);
    });

    var active = 0;
    var from = Float32Array.from(forms[0]);
    var live = Float32Array.from(from);
    var to = forms[0];

    var jitter = new Float32Array(n * 3);
    for (var i = 0; i < n * 3; i++) jitter[i] = Math.random() * 2 - 1;
    var bow = new Float32Array(n * 3);
    var reach = new Float32Array(n);
    var sweep = 0;

    var sx = new Float32Array(n);
    var sy = new Float32Array(n);
    var sr = new Float32Array(n);
    var step = new Uint8Array(n);

    var state = { p: 1 };
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var width = 0;
    var height = 0;
    var color = '#EDEAE2';
    var frame = 0;
    var previous = 0;
    var spin = 0.6;
    var clock = 0;
    var visible = true;

    function updateLabel() {
      var name = LABELS[list[active]] || list[active];
      if (labelIdx) {
        labelIdx.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
      }
      if (labelName) labelName.textContent = name;
      host.setAttribute(
        'aria-label',
        'Particle field showing ' + name + '. Click to morph to the next shape.'
      );
    }

    function sample(p) {
      var total = 1 + STAGGER;
      for (var i = 0; i < n; i++) {
        var offset = (i / n + sweep) % 1;
        var raw = p * total - offset * STAGGER;
        var t = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
        var e = easeInOutCubic(t);
        var arc = reach[i] * BOW * Math.sin(Math.PI * t);
        for (var a = 0; a < 3; a++) {
          var j = i * 3 + a;
          live[j] = from[j] + (to[j] - from[j]) * e + bow[j] * arc;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      if (!width || !height) return;
      var cx = width / 2;
      var cy = height / 2;
      var fit = Math.min(width, height) * FIT;
      var dot = Math.max(0.7, Math.min(width, height) * 0.0055);
      var tiltX = 0.42 + 0.08 * Math.sin(clock * 0.31);
      var cosY = Math.cos(spin);
      var sinY = Math.sin(spin);
      var cosX = Math.cos(tiltX);
      var sinX = Math.sin(tiltX);

      for (var i = 0; i < n; i++) {
        var x = live[i * 3];
        var y = live[i * 3 + 1];
        var z = live[i * 3 + 2];
        var x1 = x * cosY + z * sinY;
        var z1 = z * cosY - x * sinY;
        var y2 = y * cosX - z1 * sinX;
        var z2 = y * sinX + z1 * cosX;
        var scale = FOV / (FOV + z2);
        sx[i] = cx + x1 * scale * fit;
        sy[i] = cy - y2 * scale * fit;
        var depth = Math.max(0, Math.min(1, (scale - 0.74) / 0.66));
        sr[i] = dot * (0.55 + 0.75 * depth);
        step[i] = Math.min(DEPTH_STEPS - 1, (depth * DEPTH_STEPS) | 0);
      }

      ctx.fillStyle = color;
      for (var b = 0; b < DEPTH_STEPS; b++) {
        ctx.globalAlpha = 0.2 + 0.8 * Math.pow((b + 0.5) / DEPTH_STEPS, 1.3);
        ctx.beginPath();
        for (var i2 = 0; i2 < n; i2++) {
          if (step[i2] !== b) continue;
          ctx.moveTo(sx[i2] + sr[i2], sy[i2]);
          ctx.arc(sx[i2], sy[i2], sr[i2], 0, TAU);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function tick(now) {
      var delta = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      clock += delta;
      spin += delta * 0.22;
      if (state.p < 1) {
        state.p = Math.min(1, state.p + delta / span);
      }
      sample(state.p);
      draw();
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    function update() {
      stop();
      sample(state.p);
      draw();
      if (visible && !document.hidden && !reduced.matches) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    function advance() {
      from.set(live);
      active = (active + 1) % forms.length;
      to = forms[active];
      updateLabel();
      sweep = Math.random();
      for (var i = 0; i < n; i++) {
        var dx = to[i * 3] - from[i * 3];
        var dy = to[i * 3 + 1] - from[i * 3 + 1];
        var dz = to[i * 3 + 2] - from[i * 3 + 2];
        reach[i] = Math.hypot(dx, dy, dz);
        var mx = (from[i * 3] + to[i * 3]) / 2 + jitter[i * 3] * 0.24;
        var my = (from[i * 3 + 1] + to[i * 3 + 1]) / 2 + jitter[i * 3 + 1] * 0.16;
        var mz = (from[i * 3 + 2] + to[i * 3 + 2]) / 2 + jitter[i * 3 + 2] * 0.24;
        var len = Math.hypot(mx, my, mz) || 1;
        bow[i * 3] = mx / len;
        bow[i * 3 + 1] = my / len;
        bow[i * 3 + 2] = mz / len;
      }
      if (reduced.matches) {
        state.p = 1;
        update();
        return;
      }
      state.p = 0;
      if (!frame) update();
    }

    function resize() {
      width = host.clientWidth;
      height = host.clientHeight;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function readColor() {
      color = getComputedStyle(host).color || '#EDEAE2';
      if (!frame) draw();
    }

    updateLabel();
    readColor();
    sample(1);

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(resize);
      ro.observe(host);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        update();
      });
      io.observe(host);
    }

    var themeObserver = new MutationObserver(readColor);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme']
    });

    host.addEventListener('click', advance);
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);

    /* ---------- 随页面滚动从首屏右侧转移到目录下方 ---------- */
    var heroEl = document.getElementById('top');
    var tocPanel = document.getElementById('toc-panel');
    var slotEl = document.getElementById('hero-particle-slot');
    var isDocked = false;

    function syncDockTop() {
      if (!isDocked || !tocPanel) return;
      var hostH = host.offsetHeight || 184;
      var minTop = 74;
      var maxTop = window.innerHeight - hostH - 16;
      if (document.body.classList.contains('toc-collapsed')) {
        host.style.top = Math.max(minTop, Math.min(maxTop, 80)) + 'px';
      } else {
        var tocRect = tocPanel.getBoundingClientRect();
        var targetTop = Math.round(tocRect.bottom + 12);
        if (targetTop > maxTop) {
          targetTop = Math.max(minTop, maxTop);
        }
        host.style.top = targetTop + 'px';
      }
    }

    function setDocked(nextDocked) {
      if (nextDocked === isDocked) {
        if (isDocked) syncDockTop();
        return;
      }
      var firstRect = host.getBoundingClientRect();
      isDocked = nextDocked;

      if (isDocked) {
        host.classList.add('is-docked');
        syncDockTop();
      } else {
        host.classList.remove('is-docked');
        host.style.top = '';
      }

      if (!reduced.matches && firstRect.width > 0) {
        var lastRect = host.getBoundingClientRect();
        var dx = firstRect.left - lastRect.left;
        var dy = firstRect.top - lastRect.top;
        var sxRatio = firstRect.width / Math.max(1, lastRect.width);
        var syRatio = firstRect.height / Math.max(1, lastRect.height);

        host.style.transition = 'none';
        host.style.transformOrigin = 'top left';
        host.style.transform =
          'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + sxRatio.toFixed(3) + ',' + syRatio.toFixed(3) + ')';
        host.offsetHeight;
        host.style.transition = 'transform .42s cubic-bezier(.16,1,.3,1)';
        host.style.transform = 'none';
        setTimeout(function () {
          host.style.transition = '';
          host.style.transformOrigin = '';
          host.style.transform = '';
          resize();
        }, 440);
      } else {
        resize();
      }
    }

    function checkScrollDock() {
      if (window.innerWidth <= 1024 || !heroEl || !slotEl) {
        setDocked(false);
        return;
      }
      var heroRect = heroEl.getBoundingClientRect();
      var shouldDock = heroRect.bottom < 220;
      setDocked(shouldDock);
    }

    window.addEventListener('scroll', checkScrollDock, { passive: true });
    window.addEventListener('resize', checkScrollDock);

    var bodyObserver = new MutationObserver(function () {
      if (isDocked) setTimeout(syncDockTop, 30);
    });
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    checkScrollDock();
  }

  function init() {
    var host = document.getElementById('particle-morph');
    if (host) mountParticleMorph(host);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


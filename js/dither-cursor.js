/* =========================================================
   DitherCursorTrail — Bayer 拜耳点阵抖动像素光标拖尾 (WebGL)
   参考 Vessa/React WebGL 算法，纯原生、高帧率、低开销
   优雅融合 Neinote 的纸墨出版物与 8-Bit 复古像素美学
   ========================================================= */
(function () {
  'use strict';

  // 1. 无障碍与环境检查：无悬停能力（触控屏）或用户偏好减弱动态效果时静默退出
  if (typeof window === 'undefined' || !window.matchMedia) return;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (motionQuery.matches || !pointerQuery.matches) return;

  var POINTS = 24;
  var VERTEX = 'attribute vec2 position;\nvoid main() { gl_Position = vec4(position, 0.0, 1.0); }';
  var FRAGMENT = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 cells;',
    'uniform float aspect;',
    'uniform vec3 ink;',
    'uniform float opacity;',
    'uniform vec4 points[24];',
    'float bayer2(vec2 p) { p = floor(p); return fract(p.x / 2.0 + p.y * p.y * 0.75); }',
    'float bayer4(vec2 p) { return bayer2(0.5 * p) * 0.25 + bayer2(p); }',
    'float bayer8(vec2 p) { return bayer4(0.5 * p) * 0.25 + bayer2(p); }',
    'void main() {',
    '  vec2 cell = floor(gl_FragCoord.xy);',
    '  vec2 uv = (cell + 0.5) / cells;',
    '  vec2 p = vec2(uv.x * aspect, uv.y);',
    '  float density = 0.0;',
    '  for (int i = 0; i < 23; i++) {',
    '    vec4 a = points[i];',
    '    vec4 b = points[i + 1];',
    '    vec2 segment = b.xy - a.xy;',
    '    float t = clamp(dot(p - a.xy, segment) / max(dot(segment, segment), 1e-6), 0.0, 1.0);',
    '    float distance = length(p - a.xy - segment * t);',
    '    float radius = mix(a.z, b.z, t);',
    '    density = max(density, mix(a.w, b.w, t) * exp(-distance * distance / max(radius * radius, 1e-6)));',
    '  }',
    '  float alpha = step(bayer8(cell), density) * step(0.002, density) * opacity;',
    '  gl_FragColor = vec4(ink * alpha, alpha);',
    '}'
  ].join('\n');

  function getThemeColor() {
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    if (isDark) {
      // 暗色模式：电光荧绿微光，极富科技感与晶体质感
      return { rgb: [0.718, 0.953, 0.29], opacity: 0.55 }; // #B7F34A
    } else {
      // 浅色模式：深沉雅致的松墨绿，宛如纸面流淌的细碎点阵墨滴
      return { rgb: [0.247, 0.482, 0.094], opacity: 0.42 }; // #3F7B18
    }
  }

  function init() {
    if (document.getElementById('dither-cursor-canvas')) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'dither-cursor-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    var gl = canvas.getContext('webgl', { antialias: false, alpha: true, depth: false, premultipliedAlpha: true });
    if (!gl) return;

    var program = gl.createProgram();
    if (!program) return;

    var shaders = [];
    var dispose = function () {
      shaders.forEach(function (s) { gl.deleteShader(s); });
      gl.deleteProgram(program);
    };

    var vs = gl.createShader(gl.VERTEX_SHADER);
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs) { dispose(); return; }
    shaders.push(vs, fs);

    gl.shaderSource(vs, VERTEX);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) { dispose(); return; }

    gl.shaderSource(fs, FRAGMENT);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) { dispose(); return; }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return; }
    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    var uniforms = {
      cells: gl.getUniformLocation(program, 'cells'),
      aspect: gl.getUniformLocation(program, 'aspect'),
      ink: gl.getUniformLocation(program, 'ink'),
      opacity: gl.getUniformLocation(program, 'opacity'),
      points: gl.getUniformLocation(program, 'points[0]') || gl.getUniformLocation(program, 'points')
    };

    function updateColors() {
      var theme = getThemeColor();
      gl.uniform3fv(uniforms.ink, theme.rgb);
      gl.uniform1f(uniforms.opacity, theme.opacity);
    }
    updateColors();

    var observerTheme = new MutationObserver(function () {
      updateColors();
    });
    observerTheme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    var cellSize = 3;
    var trailRadius = 0.045;
    var maxGap = (trailRadius * 2) / (POINTS - 1);
    var chain = [];
    for (var i = 0; i < POINTS; i++) {
      chain.push({ x: 0, y: 0 });
    }
    var packed = new Float32Array(POINTS * 4);
    var target = { x: 0, y: 0 };
    var aspect = 1;
    var frame = 0;
    var previous = 0;
    var lastMove = -Infinity;
    var strength = 0;
    var initialized = false;

    var draw = function () {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (strength <= 0.001) return;

      chain.forEach(function (point, idx) {
        var taper = idx / (POINTS - 1);
        packed[idx * 4] = point.x;
        packed[idx * 4 + 1] = point.y;
        packed[idx * 4 + 2] = trailRadius * (1 - 0.22 * taper);
        packed[idx * 4 + 3] = 0.75 * (1 - 0.7 * taper) * strength;
      });
      gl.uniform4fv(uniforms.points, packed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    var stop = function () {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      strength = 0;
      initialized = false;
      lastMove = -Infinity;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    var tick = function (now) {
      frame = 0;
      var dt = Math.min(Math.max((now - previous) / 1000, 0.001), 0.05);
      previous = now;
      var active = now - lastMove < 60 ? 1 : 0;
      strength += (active - strength) * (1 - Math.pow(0.88, dt * 60));
      if (!active && strength < 0.002) {
        stop();
        return;
      }
      var ease = 1 - Math.pow(0.7, dt * 60);
      chain.forEach(function (point, idx) {
        var leader = idx === 0 ? target : chain[idx - 1];
        point.x += (leader.x - point.x) * ease;
        point.y += (leader.y - point.y) * ease;
        if (idx === 0) return;
        var dx = point.x - leader.x;
        var dy = point.y - leader.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > maxGap) {
          point.x = leader.x + (dx / distance) * maxGap;
          point.y = leader.y + (dy / distance) * maxGap;
        }
      });
      draw();
      frame = requestAnimationFrame(tick);
    };

    var resize = function () {
      var width = Math.max(window.innerWidth || document.documentElement.clientWidth, 1);
      var height = Math.max(window.innerHeight || document.documentElement.clientHeight, 1);
      canvas.width = Math.ceil(width / cellSize);
      canvas.height = Math.ceil(height / cellSize);
      canvas.style.width = (canvas.width * cellSize) + 'px';
      canvas.style.height = (canvas.height * cellSize) + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.cells, canvas.width, canvas.height);
      aspect = width / height;
      gl.uniform1f(uniforms.aspect, aspect);
      stop();
    };

    var move = function (event) {
      if (motionQuery.matches || !pointerQuery.matches || event.pointerType === 'touch' || document.hidden) return;
      var x = event.clientX;
      var y = event.clientY;
      var width = window.innerWidth || document.documentElement.clientWidth;
      var height = window.innerHeight || document.documentElement.clientHeight;
      if (x < 0 || y < 0 || x > width || y > height) {
        lastMove = -Infinity;
        return;
      }
      target.x = (x / width) * aspect;
      target.y = 1 - (y / height);
      lastMove = performance.now();
      if (!initialized) {
        chain.forEach(function (point) {
          point.x = target.x;
          point.y = target.y;
        });
        initialized = true;
      }
      if (!frame) {
        previous = lastMove;
        frame = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', stop);
    motionQuery.addEventListener('change', stop);
    pointerQuery.addEventListener('change', stop);

    resize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

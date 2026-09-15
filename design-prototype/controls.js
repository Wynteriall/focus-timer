/* Tuning panel wiring: sliders, presets, state preview, copy values. */
(function () {
  const $ = function (id) { return document.getElementById(id); };
  const p = window.BG.params;

  const sliders = [
    ['blobCount', 'blobCount'], ['blobSize', 'blobSize'],
    ['morphSpeed', 'morphSpeed'], ['blur', 'blur'],
    ['grain', 'grain'], ['parallax', 'parallax'],
    ['glowSize', 'glowSize'], ['glowIntensity', 'glowIntensity'],
  ];

  const presets = {
    lagoon:  { blobCount: 9,  blobSize: 0.33, morphSpeed: 0.6,  blur: 54, grain: 0.035, parallax: 12, glowSize: 300, glowIntensity: 0.2 },
    mist:    { blobCount: 15, blobSize: 0.30, morphSpeed: 1.0,  blur: 70, grain: 0.04,  parallax: 17, glowSize: 350, glowIntensity: 0.3 },
    tide:    { blobCount: 14, blobSize: 0.33, morphSpeed: 1.0,  blur: 54, grain: 0.035, parallax: 17, glowSize: 400, glowIntensity: 0.3 },
  };

  function showVal(id) { $(id).nextElementSibling.textContent = p[id]; }
  function bind(id) {
    const el = $(id);
    el.value = p[id];
    showVal(id);
    el.addEventListener('input', function () {
      p[id] = parseFloat(el.value);
      showVal(id);
      if (id === 'breathScale') {
        document.getElementById('timer').style.setProperty('--breath', p[id] / 100);
      }
      if (id === 'breathPeriod') {
        document.getElementById('timer').style.setProperty('--breath-ms', p[id] * 1000 + 'ms');
      }
    });
  }
  sliders.forEach(function (s) { bind(s[0]); });
  bind('breathScale'); bind('breathPeriod');
  document.getElementById('timer').style.setProperty('--breath', '0.03');
  document.getElementById('timer').style.setProperty('--breath-ms', '12000ms');

  document.querySelectorAll('[data-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      Object.assign(p, presets[btn.dataset.preset]);
      sliders.forEach(function (s) {
        $(s[0]).value = p[s[0]];
        showVal(s[0]);
      });
    });
  });

  // State preview: idle → running → paused → finished → idle
  const states = ['idle', 'running', 'paused', 'finished'];
  let si = 1; // start showing "running" (breathing)
  const timer = $('timer'), bar = $('bar'), cycle = $('state-cycle');
  function applyState() {
    const st = states[si];
    timer.classList.remove('breathing', 'paused', 'finished');
    bar.classList.remove('gone');
    p.paused = false;
    p.morphSpeed = parseFloat($('morphSpeed').value);
    if (st === 'running') {
      timer.classList.add('breathing');
      p.paused = false;
    } else if (st === 'paused') {
      timer.classList.add('paused');
      p.paused = true;
    } else if (st === 'finished') {
      timer.classList.add('finished');
      bar.classList.add('gone');
      window.BG.bloomOnce();
    }
    cycle.textContent = 'State: ' + st + ' ▸';
  }
  cycle.addEventListener('click', function () {
    si = (si + 1) % states.length;
    applyState();
  });
  applyState();

  // Copy tuned values to clipboard as JSON for pasting back to Cline
  $('copy').addEventListener('click', function () {
    const out = {};
    sliders.forEach(function (s) { out[s[0]] = p[s[0]]; });
    out.breathScale = p.breathScale;
    out.breathPeriod = p.breathPeriod;
    const text = JSON.stringify(out, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      prompt('Copy your tuned values:', text);
    }
  });

  // Auto-hiding controls: fade after 3s idle, return on any movement
  const controls = $('controls');
  let hideTimer = null;
  function wake() {
    controls.classList.remove('hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      controls.classList.add('hidden');
    }, 3000);
  }
  addEventListener('pointermove', wake);
  addEventListener('keydown', wake);
  wake();
})();
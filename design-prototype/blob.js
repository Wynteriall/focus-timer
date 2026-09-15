/* Background engine: autonomous liquid blobs + film grain + parallax + glow.
   Each blob has its own shape, size, opacity and color depth, drifts on its
   own, and lives ~60s before fading out and being replaced by a new blob. */
(function () {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: 0, y: 0 }; // normalized -1..1 from center
  let W = 0, H = 0, t = 0, last = performance.now();
  let bloom = 0, bloomT = -1; // one-shot "finished" swell envelope

  const params = {
    blobCount: 14, blobSize: 0.33, morphSpeed: 1.0, blur: 54,
    grain: 0.035, parallax: 17, glowSize: 400, glowIntensity: 0.3,
    breathScale: 3, breathPeriod: 12, paused: false,
  };

  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const TONES = [ // green depth variants: [core, mid, edge]
    [[95, 132, 101], [150, 180, 150], [220, 233, 220]],
    [[74, 111, 88], [128, 163, 138], [208, 226, 208]],
    [[130, 170, 130], [178, 202, 178], [236, 243, 236]],
  ];

  function spawn() {
    return {
      ax: rand(0.15, 0.85), ay: rand(0.15, 0.85), // anchor point
      dr: rand(0.05, 0.14),                        // drift radius
      d1: rand(0.25, 0.6), d2: rand(0.25, 0.6),    // drift speeds
      q1: rand(0, TAU), q2: rand(0, TAU),
      sizeMul: rand(0.25, 2.4),                    // strong size variety
      depth: rand(0.12, 1),                        // opacity + parallax depth
      blurMul: rand(0.4, 1.8),                     // per-blob blur variety
      tone: TONES[(Math.random() * TONES.length) | 0],
      fx: rand(1.2, 3.4), fy: rand(1.2, 3.4),      // shape frequencies
      a1: rand(0.08, 0.2), a2: rand(0.04, 0.12),   // shape amplitudes
      s1: rand(0.1, 0.3), s2: rand(0.07, 0.22),    // morph speeds
      p1: rand(0, TAU), p2: rand(0, TAU),
      age: 0, life: rand(50, 70),                  // ~1 min lifespan
    };
  }

  const blobs = [];
  for (let i = 0; i < params.blobCount; i++) blobs.push(spawn());
  function syncCount() {
    while (blobs.length < params.blobCount) blobs.push(spawn());
    if (blobs.length > params.blobCount) blobs.length = params.blobCount;
  }

  function resize() {
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  addEventListener('resize', resize);
  resize();

  addEventListener('pointermove', function (e) {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });

  function drawBlob(b, dt) {
    if (!params.paused) b.age += dt;
    if (b.age >= b.life) { Object.assign(b, spawn()); return; }
    // life envelope: ~8s fade in, ~12s fade out
    const env = Math.min(1, b.age / 8) * Math.min(1, (b.life - b.age) / 12);
    const A = (0.35 + 0.65 * b.depth) * Math.max(0, env);
    if (A < 0.004) return;
    const cx = W * (b.ax + Math.sin(t * b.d1 + b.q1) * b.dr)
      + mouse.x * params.parallax * b.depth * dpr;
    const cy = H * (b.ay + Math.cos(t * b.d2 + b.q2) * b.dr)
      + mouse.y * params.parallax * b.depth * dpr;
    const base = params.blobSize * Math.min(W, H) * 0.33
      * b.sizeMul * (1 + bloom * 0.5);
    ctx.filter = 'blur(' + params.blur * b.blurMul * dpr + 'px)';
    const c = b.tone;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 1.25);
    g.addColorStop(0, 'rgba(' + c[0] + ',' + (0.5 * A) + ')');
    g.addColorStop(0.55, 'rgba(' + c[1] + ',' + (0.3 * A) + ')');
    g.addColorStop(0.85, 'rgba(' + c[2] + ',' + (0.16 * A) + ')');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let k = 0; k <= 72; k++) {
      const th = (k / 72) * TAU;
      const w = Math.sin(b.fx * th + t * b.s1 + b.p1) * b.a1
        + Math.sin(b.fy * th - t * b.s2 + b.p2) * b.a2;
      const r = base * (1 + bloom) * (1 + w);
      const x = cx + Math.cos(th) * r, y = cy + Math.sin(th) * r;
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Grain: small noise tile, regenerated every few frames for film flicker
  const noise = document.createElement('canvas');
  noise.width = noise.height = 160;
  const nctx = noise.getContext('2d');
  let frame = 0;
  function grainTile() {
    const img = nctx.createImageData(160, 160);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (120 + Math.random() * 135) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    nctx.putImageData(img, 0, 0);
  }
  grainTile();

  function draw(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt * params.morphSpeed * (params.paused ? 0.03 : 1);
    if (bloomT >= 0) {
      bloomT += dt;
      const p = Math.min(bloomT / 2.4, 1);
      bloom = 0.16 * Math.sin(p * Math.PI) * (1 - p * 0.3);
      if (p >= 1) { bloomT = -1; bloom = 0; }
    }
    const wash = ctx.createLinearGradient(0, 0, 0, H);
    wash.addColorStop(0, '#F6FAF4');
    wash.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, H);

    syncCount();
    for (const b of blobs) drawBlob(b, dt);
    ctx.filter = 'none';

    if (params.glowIntensity > 0) {
      const gx = (mouse.x * 0.5 + 0.5) * W;
      const gy = (mouse.y * 0.5 + 0.5) * H;
      const r = params.glowSize * dpr;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
      g.addColorStop(0, 'rgba(140,180,140,' + params.glowIntensity + ')');
      g.addColorStop(1, 'rgba(140,180,140,0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = g;
      ctx.fillRect(gx - r, gy - r, r * 2, r * 2);
      ctx.globalCompositeOperation = 'source-over';
    }

    if (params.grain > 0) {
      if (frame++ % 3 === 0) grainTile();
      ctx.globalAlpha = params.grain;
      for (let y = 0; y < H; y += 160)
        for (let x = 0; x < W; x += 160) ctx.drawImage(noise, x, y);
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  window.BG = { params: params, bloomOnce: function () { if (bloomT < 0) bloomT = 0; } };
})();
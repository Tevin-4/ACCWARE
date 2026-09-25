(() => {
  const canvas = document.getElementById('mobile-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = 1;
  const particles = [];
  const COUNT = 120;
  const SPEED = 0.35;
  const BRAND = '#f44a22';

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function random(min,max){ return Math.random()*(max-min)+min; }

  function init() {
    particles.length = 0;
    for (let i=0;i<COUNT;i++){
      particles.push({
        x: random(0,w),
        y: random(0,h),
        vx: random(-SPEED,SPEED),
        vy: random(-SPEED,SPEED),
        r: random(1.2,2.8),
        a: random(0.4,0.9)
      });
    }
  }

  function step() {
    ctx.clearRect(0,0,w,h);
    for (let i=0;i<particles.length;i++){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // connections
      for (let j=i+1;j<particles.length;j++){
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx,dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(244,74,34,${0.25*(1 - dist/120)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);
          ctx.lineTo(q.x,q.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = p.a;
      ctx.fillStyle = BRAND;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }

  function start(){
    resize();
    init();
    step();
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
document.addEventListener("DOMContentLoaded", () => {
  // 确保只执行一次
  if (window.__firework_inited__) return;
  window.__firework_inited__ = true;

  // 创建 canvas
  const canvas = document.createElement("canvas");
  canvas.id = "fireworkCanvas";
  Object.assign(canvas.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 9999,
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // 尺寸自适应
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // 粒子数组
  let particles = [];

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = Math.random() * 3 + 2;
      this.angle = Math.random() * 2 * Math.PI;
      this.speed = Math.random() * 4 + 2;
      this.life = 60 + Math.floor(Math.random() * 30);
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + 0.5;
      this.speed *= 0.96;
      this.life--;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // 点击事件
  window.addEventListener("click", (e) => {
    const colors = ["#ff4d4f", "#40a9ff", "#73d13d", "#faad14", "#9254de"];
    for (let i = 0; i < 40; i++) {
      particles.push(
        new Particle(e.clientX, e.clientY, colors[Math.floor(Math.random() * colors.length)])
      );
    }
  });

  // 动画
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.life > 0);
    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });
    requestAnimationFrame(animate);
  }
  animate();

  console.log("🎆 Fireworks initialized!");
});

window.addEventListener('DOMContentLoaded', () => {
  // 动态插入 CSS
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      #particle-canvas { display: none; }
    }
  `;
  document.head.appendChild(style);

  // 创建画布...（原脚本内容，需调整 Particle 类定义）
    // 创建画布元素 
    const canvas = document.createElement('canvas'); 
    canvas.id  = 'particle-canvas';
    document.body.appendChild(canvas); 
    
    // 画布初始化 
    const ctx = canvas.getContext('2d'); 
    canvas.width  = window.innerWidth; 
    canvas.height  = window.innerHeight; 
    
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 20 + 8;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = `hsla(${Math.random() * 360}, 100%, 50%, ${this.size/5})`;
      this.gravity = 0.1;
    }
    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.1;
    }
    // ...保持其他方法不变
    draw() {
      ctx.fillStyle  = this.color; 
      ctx.beginPath(); 
      ctx.arc(this.x,  this.y, this.size,  0, Math.PI * 2);
      ctx.fill(); 
    }
  }
  // ...剩余原始脚本代码
  // 粒子池 
  let particles = [];
  
  // 动画循环优化策略
  function animate() {
    ctx.clearRect(0,  0, canvas.width,  canvas.height); 
    particles = particles.filter(p  => {
      p.update(); 
      p.draw(); 
      return p.size  > 0.2;
    });
    requestAnimationFrame(animate);
  }
  
  // 点击事件监听 
  document.addEventListener('click',  (e) => {
    for(let i=0; i<20; i++) {
      particles.push(new  Particle(e.clientX,  e.clientY)); 
    }
    if(particles.length  > 500) particles.splice(0,  200); // 性能保护 
  });

// 窗口尺寸变化监听 
window.addEventListener('resize',  () => {
  canvas.width  = window.innerWidth; 
  canvas.height  = window.innerHeight; 
});
 
// SPA路由适配
window.addEventListener('alist:route-update',  () => {
  particles = []; // 清空旧粒子 
});
  
  // 启动动画 
  animate();

});

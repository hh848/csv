// 动态创建样式
const style = document.createElement('style');
style.textContent = `
#particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  pointer-events: none;
}
  @media (max-width: 768px) {
  #particle-canvas { display: none; }
}`;
document.head.appendChild(style);

// 粒子系统代码
(function() {
  // 此处包含上述完整的JavaScript代码
  // 包括Particle类、事件监听、动画逻辑等
 window.addEventListener('DOMContentLoaded',  () => {
  // 创建画布元素 
  const canvas = document.createElement('canvas'); 
  canvas.id  = 'particle-canvas';
  document.body.appendChild(canvas); 
  
  // 画布初始化 
  const ctx = canvas.getContext('2d'); 
  canvas.width  = window.innerWidth; 
  canvas.height  = window.innerHeight; 
  
  // 粒子系统实现
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size  = Math.random()  * 20 + 8
      this.speedX  = Math.random()  * 2 - 1;
      this.speedY  = Math.random()  * 2 - 1;
      this.color  = `hsl(${Math.random()  * 360}, 100%, 50%)`;
    }
    update() {
      this.x += this.speedX; 
      this.y += this.speedY; 
      if (this.size  > 0.2) this.size  -= 0.1;
    }
    draw() {
      ctx.fillStyle  = this.color; 
      ctx.beginPath(); 
      ctx.arc(this.x,  this.y, this.size,  0, Math.PI * 2);
      ctx.fill(); 
    }
  }
 
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
  
  // 启动动画 
  animate();
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

// 添加重力效果 
const gravity = 0.1;
class Particle {
  //...
  update() {
    this.speedY  += gravity; // 添加重力加速度 
    //...
  }
}
 
// 添加渐隐效果 
ctx.fillStyle  = `hsla(${Math.random()*360},  100%, 50%, ${this.size/5})`;   
})();

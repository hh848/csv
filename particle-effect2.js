(function() {
  'use strict';

  
window.addEventListener('DOMContentLoaded', () => {
  // 动态插入 CSS
  const style = document.createElement('style');
  style.textContent = `
    /* 特效画布定位 */
  #particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999;
    pointer-events: none;
  }

      /* 移动端适配 */
    @media (max-width: 768px) {
      #particle-canvas { display: none; }
    }
  `;
  document.head.appendChild(style);


    // 创建画布元素 
    const canvas = document.createElement('canvas'); 
    canvas.id  = 'particle-canvas';
    document.body.appendChild(canvas); 
    
    // 画布初始化 
    const ctx = canvas.getContext('2d'); 
    canvas.width  = window.innerWidth; 
    canvas.height  = window.innerHeight; 

    // Particle 类定义
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 20 + 8;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = `hsla(${Math.random() * 360}, 100%, 50%, ${this.size/5})`;
      this.gravity = 0.03;
    }
    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.1;
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

// 窗口尺寸变化监听 
window.addEventListener('resize',  () => {
  canvas.width  = window.innerWidth; 
  canvas.height  = window.innerHeight; 
});
 
// SPA路由适配
window.addEventListener('alist:route-update',  () => {
  particles = []; // 清空旧粒子 
});


  
    // 路由变化处理器
    /* const clearOnRouteChange = () => {
    particles = [];
    canvas.width = canvas.width; // 强制清空画布
    }; */


// 添加防抖处理
let clearTimeoutId;
const clearOnRouteChange = () => {
  clearTimeout(clearTimeoutId);
  clearTimeoutId = setTimeout(() => {
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 100); // 100ms内多次路由变化只执行一次
};


  // 监听所有路由变化方式
  const routingEvents = [
    'popstate',       // 浏览器前进/后退
    'hashchange',     // Hash路由变化
    'locationchange'  // 自定义pushState事件
  ];

  routingEvents.forEach(event => {
    window.addEventListener(event, clearOnRouteChange);
  });

  // 劫持History API
  const historyMethods = ['pushState', 'replaceState'];
  historyMethods.forEach(method => {
    const original = history[method];
    history[method] = function(...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };
  });

  // 特殊框架事件兼容
  const frameworkEvents = [
    'alist:route-update',     // AList
   // 'vue-router:changed',     // Vue自定义事件
   // 'react-router:update' ,     // React自定义事件
  ];

  frameworkEvents.forEach(event => {
    window.addEventListener(event, clearOnRouteChange);
  });
  
  
  // 启动动画 
  animate();

});

})();

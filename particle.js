(function() {
  'use strict';

  // ================ 配置系统 ================
  const defaultConfig = {
    gravity: 0.03,
    particleSize: [8, 25],
    colors: 'random',
    maxParticles: 500,
    spawnCount: 20,
    fadeSpeed: 0.1,
    autoInit: true
  };

  // 合并用户配置
  window.ParticleEffect = window.ParticleEffect || {};
  const config = {
    ...defaultConfig,
    ...(window.ParticleEffect.config || {})
  };

  // ================ 样式注入 ================
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
      #particle-canvas {
        display: none;
      }
    }`;
  document.head.appendChild(style);

  // ================ 粒子系统核心 ================
  let canvas, ctx, particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 
        (config.particleSize[1] - config.particleSize[0]) + 
        config.particleSize[0];
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1.5;
      this.color = this._getColor();
    }

    _getColor() {
      if (config.colors === 'random') {
        return `hsla(${Math.random()*360}, 100%, 50%, ${this.size/15})`;
      }
      return config.colors[Math.floor(Math.random()*config.colors.length)];
    }

    update() {
      this.speedY += config.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= config.fadeSpeed;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ================ 动画控制 ================
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => {
      p.update();
      p.draw();
      return p.size > 0.2;
    });
    requestAnimationFrame(animate);
  }

  // ================ 事件处理 ================
  function handleClick(e) {
    for(let i=0; i<config.spawnCount; i++) {
      particles.push(new Particle(e.clientX, e.clientY));
    }
    if(particles.length > config.maxParticles) {
      particles.splice(0, particles.length - config.maxParticles);
    }
  }

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ================ 初始化函数 ================
  function init() {
    // 创建画布
    canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    handleResize();

    // 事件监听
    /*document.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    window.addEventListener('alist:route-update', () => particles = []); */



  // 路由变化处理器
  const clearOnRouteChange = () => {
    particles = [];
    canvas.width = canvas.width; // 强制清空画布
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
   // 'react-router:update'     // React自定义事件
  ];

  frameworkEvents.forEach(event => {
    window.addEventListener(event, clearOnRouteChange);
  });



    // 启动动画
    animate();
  }

  // ================ 暴露接口 ================
  window.ParticleEffect.init = init;

  // 自动初始化
  if (config.autoInit) {
    window.addEventListener('DOMContentLoaded', init);
  }
})();

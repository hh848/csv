// 采用 UMD 格式兼容多种引入方式
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' 
      ? factory(require('vue')) 
      : typeof define === 'function' && define.amd 
        ? define(['vue'], factory) 
        : (global = global || self, factory(global.Vue));
  })(this, function(Vue) {
    'use strict';
  
    const STATS_API = 'https://analytics.53953.eu.org/api/visit';
    const VERSION = '1.1.0';
  
    // 响应式状态仓库
    const store = Vue.reactive({ uv: '-', pv: '-' });
  
    // 核心统计方法
    const fetchStats = async () => {
      try {
        const res = await fetch(STATS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: location.pathname,
            hostname: location.hostname,
            referrer: document.referrer,
            pv: true,
            uv: true
          })
        });
        
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const { data } = await res.json();
        
        Object.assign(store, data);
      } catch (err) {
        console.error(`[Webviso@${VERSION}] 统计异常:`, err);
      }
    };
  
    // Vue 插件安装器
    const install = (app) => {
      // 提供全局访问接口
      app.provide('webviso', store);
      
      // 自动挂载逻辑
      app.mixin({
        mounted() {
          if (this.$options.needWebviso !== false) {
            fetchStats();
          }
        }
      });
    };
  
    // 暴露公共接口
    return { install, store, fetchStats, VERSION };
  });
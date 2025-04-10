// analytics.js - 增强容错版
document.addEventListener('DOMContentLoaded', function() {
  const safeUpdate = (element, value) => {
    if(element && typeof value !== 'undefined') {
      element.textContent = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };

  // 本地缓存降级方案
  const loadFromCache = () => {
    safeUpdate(document.getElementById('uv-counter'), localStorage.getItem('lastUV'));
    safeUpdate(document.getElementById('pv-counter'), localStorage.getItem('lastPV'));
  };

  // 优先显示缓存
  loadFromCache();

  // 发起新请求
  fetch('https://analytics.070200.xyz/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: window.location.pathname,
      hostname: location.hostname,
      referrer: document.referrer,
      pv: true,
      uv: true
    })
  })
  .then(res => {
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    if(data?.data) {
      localStorage.setItem('lastUV', data.data.uv);
      localStorage.setItem('lastPV', data.data.pv);
      loadFromCache();
    }
  })
  .catch(error => {
    console.debug('统计更新失败，继续使用缓存');
  });
});

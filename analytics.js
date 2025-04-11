// 注意移除IIFE包裹，直接暴露初始化逻辑
const initAnalytics = () => {
  const apiUrl = 'https://analytics.070200.xyz/api/visit';
  const requestData = { 
    url: window.location.pathname,
    hostname: window.location.hostname,
    referrer: document.referrer,
    pv: true,
    uv: true
  };
Access-Control-Allow-Origin: *

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if(data.data) {
      const uvElement = document.getElementById('uv-counter');
      const pvElement = document.getElementById('pv-counter');
      uvElement && (uvElement.textContent = data.data.uv);
      pvElement && (pvElement.textContent = data.data.pv);
    }
  })
  .catch(e => console.log('统计加载延迟'));
}

// 更健壮的加载事件处理
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
  initAnalytics();
}

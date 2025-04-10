// 文件：analytics.js（完整修复版）
// 使用 MutationObserver 确保元素插入后再执行统计
const observer = new MutationObserver((mutations) => {
  if (document.getElementById('uv-counter') {
    observer.disconnect();
    executeAnalytics();
  }
});

// 监听 body 变化
observer.observe(document.body, {
  childList: true,
  subtree: true
});

function executeAnalytics() {
  const apiUrl = 'https://analytics.070200.xyz/api/visit';
  
  fetch(apiUrl, {
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
  .then(res => res.json())
  .then(data => {
    if(data?.data) {
      document.getElementById('uv-counter').textContent = data.data.uv;
      document.getElementById('pv-counter').textContent = data.data.pv;
    }
  })
  .catch(console.debug);
}

// 降级方案：DOMContentLoaded 后10秒强制执行
setTimeout(executeAnalytics, 10000);

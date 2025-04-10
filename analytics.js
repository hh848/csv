// 文件：analytics.js（上传至你的存储服务）
document.addEventListener('DOMContentLoaded', function() {
  // 仅执行数据请求，不操作DOM
  fetch('https://analytics.070200.xyz/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: window.location.pathname,
      hostname: window.location.hostname,
      referrer: document.referrer,
      pv: true,
      uv: true
    })
  })
  .then(res => res.json())
  .then(data => {
    if(data?.data) {
      // 仅在元素存在时更新
      const uvElement = document.getElementById('uv-counter');
      const pvElement = document.getElementById('pv-counter');
      if(uvElement) uvElement.textContent = data.data.uv;
      if(pvElement) pvElement.textContent = data.data.pv;
    }
  })
  .catch(error => console.debug('统计加载失败（静默模式）'));
});

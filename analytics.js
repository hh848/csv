document.addEventListener('DOMContentLoaded', function() {
  const uvElement = document.getElementById('uv-counter');
  const pvElement = document.getElementById('pv-counter');
  
  // 从本地存储读取缓存
  const lastUV = localStorage.getItem('lastUV') || '0';
  const lastPV = localStorage.getItem('lastPV') || '0';
  
  uvElement.textContent = lastUV;
  pvElement.textContent = lastPV;

  // 继续尝试请求新数据
  fetch('https://analytics.070200.xyz/api/visit', {/* 原有参数 */})
  .then(res => res.json())
  .then(data => {
    if(data?.data) {
      localStorage.setItem('lastUV', data.data.uv);
      localStorage.setItem('lastPV', data.data.pv);
      // 更新显示...
    }
  })
  .catch(() => {/* 静默失败 */});
});

// 添加DOM存在性检查和重试机制
const initAnalytics = (retryCount = 0) => {
  // 防御性检查
  const isElementReady = () => {
    return document.getElementById('uv-counter') && document.getElementById('pv-counter');
  };

  // 如果元素未加载且重试次数未超过3次
  if (!isElementReady() && retryCount < 3) {
    setTimeout(() => initAnalytics(retryCount + 1), 500 * (retryCount + 1));
    return;
  }

  // 正式请求
  fetch('https://analytics.53953.eu.org/api/visit', {
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
  .then(res => {
    if (!res.ok) throw new Error(`HTTP错误 ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log('统计响应:', data);
    if (data?.data) {
      document.getElementById('uv-counter').textContent = data.data.uv || 'N/A';
      document.getElementById('pv-counter').textContent = data.data.pv || 'N/A';
    }
  })
  .catch(err => {
    console.warn('统计加载失败:', err);
    document.getElementById('uv-counter').textContent = '-';
    document.getElementById('pv-counter').textContent = '-';
  });
};

// 启动初始化
if (document.readyState === 'complete') {
  initAnalytics();
} else {
  document.addEventListener('DOMContentLoaded', () => initAnalytics());
}

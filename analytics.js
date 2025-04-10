document.addEventListener('DOMContentLoaded', function() {
  // 调试标记1：检查脚本是否加载
  console.log('[Analytics] 脚本已加载');
  
  fetch('https://analytics.070200.xyz/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ /* 参数保持不变 */ })
  })
  .then(res => {
    // 调试标记2：检查网络响应状态
    console.log('[Analytics] 响应状态:', res.status);
    if (!res.ok) throw new Error(`HTTP错误 ${res.status}`);
    return res.json();
  })
  .then(data => {
    // 调试标记3：打印完整响应数据
    console.log('[Analytics] 完整响应:', data);
    
    const uvElement = document.getElementById('uv-counter');
    const pvElement = document.getElementById('pv-counter');
    
    // 调试标记4：检查元素是否存在
    if (!uvElement || !pvElement) {
      throw new Error('未找到统计元素');
    }

    if(data?.data) {
      uvElement.textContent = data.uv || data.result.uv || data.data.stats.uv ?? 'N/A';
      pvElement.textContent = data.pv || data.result.pv || data.data.stats.pv ?? 'N/A';
    }
  })
  .catch(error => {
    // 显示详细错误信息
    console.error('[Analytics] 错误详情:', error);
    document.querySelectorAll('#uv-counter, #pv-counter').forEach(el => {
      el.textContent = '数据异常';
    });
  });
});

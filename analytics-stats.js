// analytics.v1.0.0.js
(() => {
  const CONFIG = {
    apiUrl: document.currentScript?.dataset?.apiUrl || 'https://analytics.53953.org/api/visit',
    counters: JSON.parse(document.currentScript?.dataset?.counters || '{"uv":"uv-counter","pv":"pv-counter"}')
  };

  const sendAnalytics = () => {
    fetch(CONFIG.apiUrl, {
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
      if(data.data) {
        document.getElementById(CONFIG.counters.uv).textContent = data.data.uv;
        document.getElementById(CONFIG.counters.pv).textContent = data.data.pv;
      }
    })
    .catch(console.error);
  };

  document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', sendAnalytics)
    : sendAnalytics();
})();
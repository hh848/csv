class WebvisoStats extends HTMLElement {
  static get observedAttributes() { return ['api-url']; }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._data = { uv: 0, pv: 0 };
  }

  connectedCallback() {
    this._render();
    this._loadData();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'api-url' && oldVal !== newVal) {
      this._loadData();
    }
  }

  async _loadData() {
    const apiUrl = this.getAttribute('api-url') || 'https://analytics.xbxin.com/api/visit';
    
    try {
      const res = await fetch(apiUrl, {
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

      if (!res.ok) throw new Error(res.statusText);
      const { data } = await res.json();
      
      this._data = data;
      this._updateCounters();
    } catch (err) {
      console.error('[Webviso] 统计加载失败:', err);
      this._showError();
    }
  }

  _render() {
    this._shadow.innerHTML = `
      <style>
        :host { display: block; margin: 1rem 0; }
        .counter { margin: 0.5em 0; color: #666; }
        [data-counter] { color: #1890ff; font-weight: bold; }
        .error { color: #ff4d4f; }
      </style>
      <slot></slot>
    `;
  }

  _updateCounters() {
    this.querySelectorAll('[data-counter]').forEach(el => {
      el.textContent = this._data[el.dataset.counter] || '0';
    });
  }

  _showError() {
    const errorEl = document.createElement('div');
    errorEl.className = 'error';
    errorEl.textContent = '统计信息暂不可用';
    this._shadow.appendChild(errorEl);
  }
}

customElements.define('webviso-stats', WebvisoStats);

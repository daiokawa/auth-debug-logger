let socket = null;
let allLogs = [];
let filteredLogs = [];

function initializeSocket() {
  socket = io('http://localhost:8888');
  
  socket.on('connect', () => {
    updateConnectionStatus(true);
    console.log('Connected to auth debug logger');
  });
  
  socket.on('disconnect', () => {
    updateConnectionStatus(false);
    console.log('Disconnected from auth debug logger');
  });
  
  socket.on('auth-log', (logEntry) => {
    addLogEntry(logEntry);
  });
}

function updateConnectionStatus(connected) {
  const statusEl = document.getElementById('connection-status');
  if (connected) {
    statusEl.textContent = '● Connected';
    statusEl.className = 'status-indicator connected';
  } else {
    statusEl.textContent = '● Disconnected';
    statusEl.className = 'status-indicator disconnected';
  }
}

function addLogEntry(logEntry) {
  allLogs.unshift(logEntry);
  if (allLogs.length > 1000) {
    allLogs.pop();
  }
  applyFilters();
}

function renderLogs() {
  const logsList = document.getElementById('logs-list');
  
  if (filteredLogs.length === 0) {
    logsList.innerHTML = `
      <div class="empty-state">
        <p>No authentication logs yet.</p>
        <p class="hint">Configure your app to use proxy:</p>
        <code>HTTP_PROXY=http://localhost:8888</code>
      </div>
    `;
    return;
  }
  
  logsList.innerHTML = filteredLogs.map(log => {
    const statusClass = getStatusClass(log.response?.status);
    const hasError = log.error ? 'error' : 'success';
    
    return `
      <div class="log-entry ${hasError}" onclick="showLogDetail(${allLogs.indexOf(log)})">
        <div class="log-entry-header">
          <div>
            <span class="log-method">${log.method}</span>
            <span class="log-url">${log.url}</span>
          </div>
          <div>
            ${log.response ? `<span class="log-status ${statusClass}">${log.response.status}</span>` : ''}
            ${log.duration ? `<span class="log-duration">${log.duration}ms</span>` : ''}
          </div>
        </div>
        ${log.tags && log.tags.length > 0 ? `
          <div class="log-tags">
            ${log.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function getStatusClass(status) {
  if (!status) return '';
  if (status >= 200 && status < 300) return 'status-2xx';
  if (status >= 300 && status < 400) return 'status-3xx';
  if (status >= 400 && status < 500) return 'status-4xx';
  if (status >= 500) return 'status-5xx';
  return '';
}

function showLogDetail(index) {
  const log = allLogs[index];
  const detailEl = document.getElementById('log-detail');
  const contentEl = document.getElementById('detail-content');
  
  let content = `
    <div class="detail-section">
      <h3>Request</h3>
      <p><strong>Method:</strong> ${log.method}</p>
      <p><strong>URL:</strong> ${log.url}</p>
      <p><strong>Timestamp:</strong> ${new Date(log.timestamp).toLocaleString()}</p>
    </div>
  `;
  
  if (log.headers) {
    content += `
      <div class="detail-section">
        <h3>Request Headers</h3>
        <pre>${JSON.stringify(log.headers, null, 2)}</pre>
      </div>
    `;
  }
  
  if (log.body) {
    content += `
      <div class="detail-section">
        <h3>Request Body</h3>
        <pre>${JSON.stringify(log.body, null, 2)}</pre>
      </div>
    `;
  }
  
  if (log.response) {
    content += `
      <div class="detail-section">
        <h3>Response</h3>
        <p><strong>Status:</strong> ${log.response.status}</p>
        <p><strong>Duration:</strong> ${log.duration}ms</p>
      </div>
    `;
    
    if (log.response.headers) {
      content += `
        <div class="detail-section">
          <h3>Response Headers</h3>
          <pre>${JSON.stringify(log.response.headers, null, 2)}</pre>
        </div>
      `;
    }
    
    if (log.response.body) {
      content += `
        <div class="detail-section">
          <h3>Response Body</h3>
          <pre>${JSON.stringify(log.response.body, null, 2)}</pre>
        </div>
      `;
    }
  }
  
  if (log.error) {
    content += `
      <div class="detail-section">
        <h3>Error</h3>
        <pre>${log.error}</pre>
      </div>
    `;
  }
  
  contentEl.innerHTML = content;
  detailEl.classList.remove('hidden');
}

function closeDetail() {
  document.getElementById('log-detail').classList.add('hidden');
}

function applyFilters() {
  const serviceFilter = document.getElementById('service-filter').value;
  const statusFilter = document.getElementById('status-filter').value;
  const searchFilter = document.getElementById('search-filter').value.toLowerCase();
  
  filteredLogs = allLogs.filter(log => {
    if (serviceFilter && (!log.tags || !log.tags.includes(serviceFilter))) {
      return false;
    }
    
    if (statusFilter && log.response) {
      const status = log.response.status;
      if (statusFilter === '2xx' && (status < 200 || status >= 300)) return false;
      if (statusFilter === '3xx' && (status < 300 || status >= 400)) return false;
      if (statusFilter === '4xx' && (status < 400 || status >= 500)) return false;
      if (statusFilter === '5xx' && status < 500) return false;
    }
    
    if (searchFilter) {
      const searchableText = JSON.stringify(log).toLowerCase();
      if (!searchableText.includes(searchFilter)) {
        return false;
      }
    }
    
    return true;
  });
  
  renderLogs();
}

function clearLogs() {
  allLogs = [];
  filteredLogs = [];
  renderLogs();
}

function exportLogs() {
  const dataStr = JSON.stringify(allLogs, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `auth-logs-${new Date().toISOString()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

async function loadRecentLogs() {
  try {
    const response = await fetch('/api/logs?limit=100');
    const logs = await response.json();
    allLogs = logs;
    applyFilters();
  } catch (error) {
    console.error('Failed to load recent logs:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeSocket();
  loadRecentLogs();
  
  document.getElementById('service-filter').addEventListener('change', applyFilters);
  document.getElementById('status-filter').addEventListener('change', applyFilters);
  document.getElementById('search-filter').addEventListener('input', applyFilters);
  document.getElementById('clear-logs').addEventListener('click', clearLogs);
  document.getElementById('export-logs').addEventListener('click', exportLogs);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetail();
    }
  });
});
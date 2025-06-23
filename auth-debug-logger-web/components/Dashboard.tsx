'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthLogEntry } from '@/lib/types';
import AutoMonitorBanner from './AutoMonitorBanner';

export default function Dashboard() {
  const [logs, setLogs] = useState<AuthLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuthLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuthLogEntry | null>(null);
  const [filters, setFilters] = useState({
    service: '',
    status: '',
    search: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/logs?limit=100');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        console.warn('Unexpected response format:', data);
        setLogs([]);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
      setError(error instanceof Error ? error.message : 'Failed to load logs');
    }
  }, []);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, [loadLogs]);

  useEffect(() => {
    let filtered = logs;

    if (filters.service) {
      filtered = filtered.filter(log => 
        log.tags?.includes(filters.service)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(log => {
        const status = log.response?.status;
        if (!status) return false;
        
        switch (filters.status) {
          case '2xx': return status >= 200 && status < 300;
          case '3xx': return status >= 300 && status < 400;
          case '4xx': return status >= 400 && status < 500;
          case '5xx': return status >= 500;
          default: return true;
        }
      });
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        JSON.stringify(log).toLowerCase().includes(searchLower)
      );
    }

    setFilteredLogs(filtered);
  }, [logs, filters]);

  const getStatusClass = (status?: number) => {
    if (!status) return '';
    if (status >= 200 && status < 300) return 'status-2xx';
    if (status >= 300 && status < 400) return 'status-3xx';
    if (status >= 400 && status < 500) return 'status-4xx';
    if (status >= 500) return 'status-5xx';
    return '';
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `auth-logs-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto bg-white">
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900">🔐 Auth Debug Logger (Claude Code Auto-Monitor)</h1>
        <div className="flex items-center gap-4">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            ● {isConnected ? 'Connected' : 'Monitoring'}
          </span>
          <button 
            onClick={() => setLogs([])}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors text-gray-700"
          >
            Clear Display
          </button>
          <button 
            onClick={exportLogs}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors text-white"
          >
            Export Logs
          </button>
        </div>
      </header>

      <AutoMonitorBanner />

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Service:</label>
          <select 
            value={filters.service}
            onChange={(e) => setFilters({...filters, service: e.target.value})}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          >
            <option value="">All Services</option>
            <option value="google-auth">Google</option>
            <option value="stripe-api">Stripe</option>
            <option value="twitter-auth">Twitter</option>
            <option value="facebook-auth">Facebook</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status:</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          >
            <option value="">All Status</option>
            <option value="2xx">Success (2xx)</option>
            <option value="3xx">Redirect (3xx)</option>
            <option value="4xx">Client Error (4xx)</option>
            <option value="5xx">Server Error (5xx)</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm text-gray-600">Search:</label>
          <input 
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            placeholder="Search in URL or body..."
            className="flex-1 px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff]"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p className="font-semibold">Error loading logs</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>No authentication logs yet.</p>
            <p className="mt-2 text-sm">Claude Code will automatically monitor and analyze authentication logs</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <div 
                key={index}
                onClick={() => setSelectedLog(log)}
                className={`log-entry ${log.error ? 'error' : 'success'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{log.method}</span>
                    <span className="text-blue-600 truncate max-w-xl">{log.url}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {log.response && (
                      <span className={`log-status ${getStatusClass(log.response.status)}`}>
                        {log.response.status}
                      </span>
                    )}
                    {log.duration && (
                      <span className="text-sm text-gray-500">{log.duration}ms</span>
                    )}
                  </div>
                </div>
                {log.tags && log.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {log.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedLog && (
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLog(null)}>
          <div className="bg-white border border-gray-200 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-3 text-gray-900">Request</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Method:</strong> {selectedLog.method}</p>
                  <p><strong>URL:</strong> {selectedLog.url}</p>
                  <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
              </section>

              {selectedLog.headers && (
                <section>
                  <h3 className="text-lg font-medium mb-3 text-gray-900">Request Headers</h3>
                  <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm text-gray-800">
                    {JSON.stringify(selectedLog.headers, null, 2)}
                  </pre>
                </section>
              )}

              {selectedLog.body && (
                <section>
                  <h3 className="text-lg font-medium mb-3 text-gray-900">Request Body</h3>
                  <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm text-gray-800">
                    {JSON.stringify(selectedLog.body, null, 2)}
                  </pre>
                </section>
              )}

              {selectedLog.response && (
                <>
                  <section>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">Response</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Status:</strong> {selectedLog.response.status}</p>
                      {selectedLog.duration && <p><strong>Duration:</strong> {selectedLog.duration}ms</p>}
                    </div>
                  </section>

                  {selectedLog.response.headers && (
                    <section>
                      <h3 className="text-lg font-medium mb-3 text-gray-900">Response Headers</h3>
                      <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm text-gray-800">
                        {JSON.stringify(selectedLog.response.headers, null, 2)}
                      </pre>
                    </section>
                  )}

                  {selectedLog.response.body && (
                    <section>
                      <h3 className="text-lg font-medium mb-3 text-gray-900">Response Body</h3>
                      <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm text-gray-800">
                        {JSON.stringify(selectedLog.response.body, null, 2)}
                      </pre>
                    </section>
                  )}
                </>
              )}

              {selectedLog.error && (
                <section>
                  <h3 className="text-lg font-medium mb-3 text-red-600">Error</h3>
                  <pre className="bg-red-50 border border-red-200 rounded-md p-4 overflow-x-auto text-sm text-red-700">
                    {selectedLog.error}
                  </pre>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
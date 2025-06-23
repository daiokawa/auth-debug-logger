import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export interface Config {
  proxyPort: number;
  webUIPort: number;
  logLevel: string;
  logFilePath: string;
  monitoredHosts: string[];
  authEndpoints: string[];
  autoOpenBrowser: boolean;
}

export const config: Config = {
  proxyPort: parseInt(process.env.PROXY_PORT || '8888', 10),
  webUIPort: parseInt(process.env.WEB_UI_PORT || '3333', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  logFilePath: process.env.LOG_FILE_PATH || './logs',
  monitoredHosts: (process.env.MONITORED_HOSTS || 'accounts.google.com,api.stripe.com,api.twitter.com,graph.facebook.com')
    .split(',')
    .map(h => h.trim())
    .filter(Boolean),
  authEndpoints: (process.env.AUTH_ENDPOINTS || '/oauth,/auth,/token,/login,/signin,/signup')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean),
  autoOpenBrowser: process.env.AUTO_OPEN_BROWSER !== 'false'
};

export function isMonitoredRequest(url: string): boolean {
  const urlObj = new URL(url);
  return config.monitoredHosts.some(host => urlObj.hostname.includes(host)) ||
         config.authEndpoints.some(endpoint => urlObj.pathname.includes(endpoint));
}
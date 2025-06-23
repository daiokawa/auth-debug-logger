import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';
import { authLogger, AuthLogEntry } from '../utils/logger';
import { isMonitoredRequest } from '../utils/config';
import { Socket } from 'socket.io';

let io: Socket | null = null;

export function setSocketIO(socket: Socket) {
  io = socket;
}

export function createAuthProxy(target: string): ReturnType<typeof createProxyMiddleware> {
  const startTime = Date.now();
  let requestData: Partial<AuthLogEntry> = {};

  const options: Options = {
    target,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq: (proxyReq, req, res) => {
      const fullUrl = `${target}${req.url}`;
      
      if (isMonitoredRequest(fullUrl)) {
        requestData = {
          timestamp: new Date(),
          method: req.method,
          url: fullUrl,
          headers: req.headers as Record<string, string | string[]>,
          body: (req as any).body,
          tags: detectAuthType(fullUrl, req.headers)
        };
      }

      if ((req as any).body && Object.keys((req as any).body).length > 0) {
        const bodyData = JSON.stringify((req as any).body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      const fullUrl = `${target}${req.url}`;
      
      if (isMonitoredRequest(fullUrl)) {
        let responseBody = '';
        
        proxyRes.on('data', (chunk) => {
          responseBody += chunk.toString();
        });

        proxyRes.on('end', () => {
          const duration = Date.now() - startTime;
          
          const logEntry: AuthLogEntry = {
            ...requestData as AuthLogEntry,
            response: {
              status: proxyRes.statusCode || 0,
              headers: proxyRes.headers as Record<string, string | string[]>,
              body: tryParseJSON(responseBody)
            },
            duration
          };

          authLogger.logRequest(logEntry);
          
          if (io) {
            io.emit('auth-log', logEntry);
          }
        });
      }

      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res);
    },
    onError: (err, req, res) => {
      const fullUrl = `${target}${req.url}`;
      
      if (isMonitoredRequest(fullUrl)) {
        const logEntry: AuthLogEntry = {
          ...requestData as AuthLogEntry,
          error: err.message,
          duration: Date.now() - startTime
        };
        
        authLogger.logRequest(logEntry);
        
        if (io) {
          io.emit('auth-log', logEntry);
        }
      }

      if (res instanceof Response && !res.headersSent) {
        res.status(500).json({ error: 'Proxy error', details: err.message });
      }
    }
  };

  return createProxyMiddleware(options);
}

function tryParseJSON(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

function detectAuthType(url: string, headers: any): string[] {
  const tags: string[] = [];
  
  if (url.includes('accounts.google.com')) tags.push('google-auth');
  if (url.includes('api.stripe.com')) tags.push('stripe-api');
  if (url.includes('api.twitter.com')) tags.push('twitter-auth');
  if (url.includes('graph.facebook.com')) tags.push('facebook-auth');
  
  if (url.includes('/oauth')) tags.push('oauth');
  if (url.includes('/token')) tags.push('token-exchange');
  if (headers.authorization) tags.push('has-auth-header');
  
  return tags;
}
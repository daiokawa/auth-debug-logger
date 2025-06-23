import express from 'express';
import path from 'path';
import { authLogger } from '../utils/logger';

export function setupWebUI(): express.Application {
  const app = express();
  
  app.use(express.static(path.join(__dirname, '../../public')));
  
  app.get('/api/logs', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const logs = authLogger.getRecentLogs(limit);
    res.json(logs);
  });
  
  app.get('/api/logs/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const interval = setInterval(() => {
      res.write(':\n\n');
    }, 30000);
    
    req.on('close', () => {
      clearInterval(interval);
    });
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
  
  return app;
}
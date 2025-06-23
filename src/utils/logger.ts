import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = process.env.LOG_FILE_PATH || './logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'auth-debug.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export interface AuthLogEntry {
  timestamp: Date;
  method: string;
  url: string;
  headers: Record<string, string | string[]>;
  body?: any;
  response?: {
    status: number;
    headers: Record<string, string | string[]>;
    body?: any;
  };
  duration?: number;
  error?: string;
  tags?: string[];
}

export const authLogger = {
  logRequest(entry: AuthLogEntry) {
    const logFile = path.join(logDir, `auth-${new Date().toISOString().split('T')[0]}.json`);
    const logEntry = JSON.stringify(entry) + '\n';
    
    fs.appendFileSync(logFile, logEntry);
    logger.info('Auth request logged', { url: entry.url, method: entry.method });
  },
  
  getRecentLogs(limit: number = 100): AuthLogEntry[] {
    const files = fs.readdirSync(logDir)
      .filter(f => f.startsWith('auth-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    const logs: AuthLogEntry[] = [];
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(logDir, file), 'utf-8');
      const lines = content.trim().split('\n').filter(Boolean);
      
      for (const line of lines.reverse()) {
        try {
          logs.push(JSON.parse(line));
          if (logs.length >= limit) return logs;
        } catch (e) {
          logger.error('Failed to parse log entry', { error: e });
        }
      }
    }
    
    return logs;
  }
};
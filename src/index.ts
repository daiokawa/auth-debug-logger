import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { createAuthProxy, setSocketIO } from './middleware/authProxy';
import { setupWebUI } from './web/dashboard';
import open from 'open';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${config.webUIPort}`,
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', (socket) => {
  logger.info('WebUI connected');
  setSocketIO(socket as any);
  
  socket.on('disconnect', () => {
    logger.info('WebUI disconnected');
  });
});

app.use('/', (req, res, next) => {
  const host = req.headers.host || 'localhost';
  const protocol = req.protocol || 'http';
  const target = `${protocol}://${host}`;
  
  createAuthProxy(target)(req, res, next);
});

export async function startProxyServer() {
  return new Promise<void>((resolve) => {
    server.listen(config.proxyPort, () => {
      logger.info(`🔌 Auth Debug Proxy running on http://localhost:${config.proxyPort}`);
      logger.info(`📝 Monitoring hosts: ${config.monitoredHosts.join(', ')}`);
      resolve();
    });
  });
}

export async function startDashboard() {
  const dashboardApp = setupWebUI();
  
  return new Promise<void>((resolve) => {
    dashboardApp.listen(config.webUIPort, async () => {
      logger.info(`🖥️  Dashboard running on http://localhost:${config.webUIPort}`);
      
      if (config.autoOpenBrowser) {
        await open(`http://localhost:${config.webUIPort}`);
      }
      
      resolve();
    });
  });
}

export async function start() {
  try {
    await startProxyServer();
    await startDashboard();
    
    logger.info('🚀 Auth Debug Logger is ready!');
    logger.info('');
    logger.info('Configure your application to use proxy:');
    logger.info(`  HTTP_PROXY=http://localhost:${config.proxyPort}`);
    logger.info(`  HTTPS_PROXY=http://localhost:${config.proxyPort}`);
    logger.info('');
    
  } catch (error) {
    logger.error('Failed to start Auth Debug Logger', { error });
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}
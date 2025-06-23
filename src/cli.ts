#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { start } from './index';

const program = new Command();

program
  .name('auth-debug-logger')
  .description('Universal authentication debugging logger for OAuth and API services')
  .version('1.0.0');

program
  .command('start')
  .description('Start the auth debug logger proxy and dashboard')
  .option('-p, --proxy-port <port>', 'Proxy server port', '8888')
  .option('-w, --web-port <port>', 'Web dashboard port', '3333')
  .option('--no-browser', 'Do not open browser automatically')
  .action(async (options) => {
    process.env.PROXY_PORT = options.proxyPort;
    process.env.WEB_UI_PORT = options.webPort;
    process.env.AUTO_OPEN_BROWSER = options.browser ? 'true' : 'false';
    
    console.log(chalk.cyan('🚀 Starting Auth Debug Logger...'));
    await start();
  });

program
  .command('init')
  .description('Initialize auth debug logger configuration')
  .action(() => {
    const configPath = path.join(process.cwd(), '.env');
    const templatePath = path.join(__dirname, '../.env.example');
    
    if (fs.existsSync(configPath)) {
      console.log(chalk.yellow('⚠️  Configuration file already exists'));
      return;
    }
    
    fs.copyFileSync(templatePath, configPath);
    console.log(chalk.green('✅ Created .env configuration file'));
    console.log(chalk.gray('   Edit .env to customize your settings'));
  });

program
  .command('logs')
  .description('View recent authentication logs')
  .option('-n, --lines <number>', 'Number of log entries to show', '20')
  .option('-f, --follow', 'Follow log output')
  .action((options) => {
    const logDir = process.env.LOG_FILE_PATH || './logs';
    const files = fs.readdirSync(logDir)
      .filter(f => f.startsWith('auth-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      console.log(chalk.yellow('No log files found'));
      return;
    }
    
    const latestFile = path.join(logDir, files[0]);
    const lines = parseInt(options.lines);
    
    if (options.follow) {
      console.log(chalk.cyan(`📋 Following ${latestFile}...`));
      const tail = require('child_process').spawn('tail', ['-f', latestFile]);
      tail.stdout.on('data', (data: Buffer) => {
        const entries = data.toString().trim().split('\n').filter(Boolean);
        entries.forEach((entry: string) => {
          try {
            const log = JSON.parse(entry);
            printLogEntry(log);
          } catch (e) {}
        });
      });
    } else {
      const content = fs.readFileSync(latestFile, 'utf-8');
      const entries = content.trim().split('\n').filter(Boolean).slice(-lines);
      
      entries.forEach(entry => {
        try {
          const log = JSON.parse(entry);
          printLogEntry(log);
        } catch (e) {}
      });
    }
  });

function printLogEntry(log: any) {
  const status = log.response?.status || 'N/A';
  const statusColor = status >= 200 && status < 300 ? chalk.green :
                     status >= 300 && status < 400 ? chalk.yellow :
                     status >= 400 ? chalk.red : chalk.gray;
  
  console.log(
    chalk.gray(new Date(log.timestamp).toLocaleTimeString()),
    chalk.cyan(log.method.padEnd(6)),
    statusColor(status.toString().padEnd(4)),
    chalk.white(log.url)
  );
  
  if (log.tags && log.tags.length > 0) {
    console.log(chalk.gray(`  Tags: ${log.tags.join(', ')}`));
  }
  
  if (log.error) {
    console.log(chalk.red(`  Error: ${log.error}`));
  }
}

program.parse();
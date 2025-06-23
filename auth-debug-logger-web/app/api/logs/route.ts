import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '100');
  
  try {
    // Use /tmp directory for Vercel deployment
    const logDir = process.env.VERCEL ? path.join(tmpdir(), 'auth-logs') : path.join(process.cwd(), 'logs');
    
    try {
      await fs.access(logDir);
    } catch {
      await fs.mkdir(logDir, { recursive: true });
      return NextResponse.json([]);
    }
    
    const files = await fs.readdir(logDir);
    const authFiles = files
      .filter(f => f.startsWith('auth-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    const logs: any[] = [];
    
    for (const file of authFiles) {
      const content = await fs.readFile(path.join(logDir, file), 'utf-8');
      const lines = content.trim().split('\n').filter(Boolean);
      
      for (const line of lines.reverse()) {
        try {
          logs.push(JSON.parse(line));
          if (logs.length >= limit) {
            return NextResponse.json(logs);
          }
        } catch (e) {
          console.error('Failed to parse log entry', e);
        }
      }
    }
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const logEntry = await request.json();
    // Use /tmp directory for Vercel deployment
    const logDir = process.env.VERCEL ? path.join(tmpdir(), 'auth-logs') : path.join(process.cwd(), 'logs');
    
    await fs.mkdir(logDir, { recursive: true });
    
    const logFile = path.join(logDir, `auth-${new Date().toISOString().split('T')[0]}.json`);
    const logLine = JSON.stringify(logEntry) + '\n';
    
    await fs.appendFile(logFile, logLine);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing log:', error);
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 });
  }
}
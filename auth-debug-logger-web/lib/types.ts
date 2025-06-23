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
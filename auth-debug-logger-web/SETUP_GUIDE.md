# Auth Debug Logger セットアップガイド

## 🚀 Claude Code用 認証エラー自動監視システム

このツールを使うと、Google、Stripe、X（Twitter）などの認証エラーをClaude Codeが自動的に監視・分析してくれます。

## セットアップ方法

### 1. 環境変数の設定（.zshrc または .bashrc に追加）

```bash
# Auth Debug Logger - Claude Code自動監視用
export AUTH_DEBUG_LOGGER_URL="https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app"
export AUTH_DEBUG_LOGGER_ENABLED=true

# 認証ログを自動送信する関数
auth_log() {
    if [ "$AUTH_DEBUG_LOGGER_ENABLED" = "true" ]; then
        local method="${1:-GET}"
        local url="$2"
        local status="${3:-0}"
        local error="$4"
        
        curl -s -X POST "$AUTH_DEBUG_LOGGER_URL/api/logs" \
            -H "Content-Type: application/json" \
            -d "{
                \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
                \"method\": \"$method\",
                \"url\": \"$url\",
                \"response\": {\"status\": $status},
                \"error\": \"$error\"
            }" > /dev/null 2>&1 &
    fi
}

# エイリアス - 開発時に便利
alias auth-debug-open="open $AUTH_DEBUG_LOGGER_URL"
alias auth-debug-test="auth_log POST 'https://api.stripe.com/v1/test' 401 'Test error'"
```

### 2. Node.js プロジェクトでの自動化

**package.json に追加:**
```json
{
  "scripts": {
    "dev:debug": "AUTH_DEBUG_PROXY=http://localhost:8888 npm run dev"
  }
}
```

**認証エラーを自動キャプチャ（axios の例）:**
```javascript
// utils/auth-debug.js
import axios from 'axios';

const AUTH_DEBUG_URL = process.env.AUTH_DEBUG_LOGGER_URL || 
  'https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app';

// Axios インターセプター
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.config && error.response) {
      // 認証関連のエラーを自動送信
      const isAuthError = 
        error.config.url?.includes('oauth') ||
        error.config.url?.includes('auth') ||
        error.config.url?.includes('stripe.com') ||
        error.config.url?.includes('google.com') ||
        error.response.status === 401 ||
        error.response.status === 403;
      
      if (isAuthError) {
        try {
          await fetch(`${AUTH_DEBUG_URL}/api/logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              method: error.config.method?.toUpperCase() || 'GET',
              url: error.config.url,
              headers: error.config.headers,
              body: error.config.data,
              response: {
                status: error.response.status,
                headers: error.response.headers,
                body: error.response.data
              },
              error: error.message,
              tags: detectAuthType(error.config.url)
            })
          });
        } catch (e) {
          // ログ送信エラーは無視
        }
      }
    }
    return Promise.reject(error);
  }
);

function detectAuthType(url) {
  const tags = [];
  if (url?.includes('stripe.com')) tags.push('stripe-api');
  if (url?.includes('google.com')) tags.push('google-auth');
  if (url?.includes('twitter.com')) tags.push('twitter-auth');
  if (url?.includes('oauth')) tags.push('oauth');
  if (url?.includes('token')) tags.push('token-exchange');
  return tags;
}
```

### 3. Python プロジェクトでの自動化

```python
# auth_debug.py
import os
import json
import requests
from datetime import datetime
from functools import wraps

AUTH_DEBUG_URL = os.environ.get(
    'AUTH_DEBUG_LOGGER_URL',
    'https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app'
)

def log_auth_error(method, url, status=None, error=None, response_data=None):
    """認証エラーをClaude Code監視システムに送信"""
    try:
        requests.post(
            f"{AUTH_DEBUG_URL}/api/logs",
            json={
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "method": method,
                "url": url,
                "response": {"status": status} if status else None,
                "error": str(error) if error else None,
                "tags": detect_auth_type(url)
            },
            timeout=1
        )
    except:
        pass  # ログ送信エラーは無視

def detect_auth_type(url):
    tags = []
    if 'stripe.com' in url: tags.append('stripe-api')
    if 'google.com' in url: tags.append('google-auth')
    if 'oauth' in url: tags.append('oauth')
    return tags

# デコレーター版
def monitor_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            # URLを引数から抽出（関数により調整が必要）
            url = kwargs.get('url', args[0] if args else 'unknown')
            log_auth_error('POST', url, error=e)
            raise
    return wrapper
```

### 4. 便利なコマンド

```bash
# セットアップ確認
echo "Auth Debug Logger URL: $AUTH_DEBUG_LOGGER_URL"

# ダッシュボードを開く
auth-debug-open

# テストログを送信
auth-debug-test

# 手動でログ送信
auth_log POST "https://api.stripe.com/v1/charges" 401 "Invalid API key"
```

### 5. VSCode 設定（.vscode/settings.json）

```json
{
  "terminal.integrated.env.osx": {
    "AUTH_DEBUG_LOGGER_URL": "https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app",
    "AUTH_DEBUG_LOGGER_ENABLED": "true"
  },
  "terminal.integrated.env.linux": {
    "AUTH_DEBUG_LOGGER_URL": "https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app",
    "AUTH_DEBUG_LOGGER_ENABLED": "true"
  }
}
```

## 使用例

1. **Stripe API エラー時**
   - 自動的にエラーがキャプチャされ、Claude Codeが分析
   - APIキーの問題、権限エラーなどを即座に特定

2. **Google OAuth エラー時**
   - リダイレクトURI、スコープ、クライアントIDの問題を自動診断
   - 正しい設定方法を提案

3. **一般的な認証エラー**
   - 401/403エラーを自動的に記録
   - トークンの有効期限、CORS問題などを分析

## Claude Codeへの指示

新しいターミナルやプロジェクトで作業する際は、Claude Codeに以下を伝えてください：

```
認証エラーが発生したら、Auth Debug Logger（https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app）で
自動的に監視・分析してください。ログはAPIで取得できます。
```

これで、どのプロジェクトでも認証エラーを自動的に解決できます！
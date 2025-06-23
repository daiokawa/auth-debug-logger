# Auth Debug Logger 🔐

A universal authentication debugging tool for Google, Stripe, X (Twitter), and other OAuth/API services. Never open developer consoles again!

**English** | [日本語](README.ja.md)

## 🚀 Quick Deploy (For Everyone!)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/daiokawa/auth-debug-logger&project-name=my-auth-debug-logger&repository-name=my-auth-debug-logger)

Click the button above to deploy your own instance in 30 seconds!

## Features

- 🔍 **Automatic Request Interception**: Captures all authentication-related HTTP traffic
- 📊 **Real-time Web Dashboard**: Beautiful UI to monitor auth flows in real-time
- 📝 **Comprehensive Logging**: Saves all auth requests/responses to disk
- 🏷️ **Smart Tagging**: Automatically identifies Google, Stripe, OAuth flows
- 🎯 **Zero Configuration**: Works out of the box with sensible defaults
- 🚀 **Lightweight**: Minimal performance impact on your applications

## Installation Options

### Option 1: Use Shared Instance (Easiest)
```bash
export AUTH_DEBUG_LOGGER_URL="https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app"
```

### Option 2: Deploy Your Own (Recommended)
Click the Deploy button above or visit:
https://vercel.com/new/clone?repository-url=https://github.com/daiokawa/auth-debug-logger

### Option 3: Local Installation
```bash
# Clone and run locally
git clone https://github.com/daiokawa/auth-debug-logger.git
cd auth-debug-logger/auth-debug-logger-web
npm install
npm run dev
```

## Quick Start

1. Start the logger:
```bash
adl start
# or
auth-debug-logger start
```

2. Configure your application to use the proxy:
```bash
export HTTP_PROXY=http://localhost:8888
export HTTPS_PROXY=http://localhost:8888
```

3. Open the dashboard at <http://localhost:3333>

4. Run your application and watch the auth logs appear!

## Usage Examples

### Node.js Application
```javascript
// Set proxy before making requests
process.env.HTTP_PROXY = 'http://localhost:8888';
process.env.HTTPS_PROXY = 'http://localhost:8888';

// Your auth code works normally
const stripe = new Stripe(process.env.STRIPE_KEY);
const charge = await stripe.charges.create({...});
```

### Python Application
```python
import os
os.environ['HTTP_PROXY'] = 'http://localhost:8888'
os.environ['HTTPS_PROXY'] = 'http://localhost:8888'

# Your auth code
import stripe
stripe.api_key = os.getenv('STRIPE_KEY')
```

### Using with Docker
```dockerfile
ENV HTTP_PROXY=http://host.docker.internal:8888
ENV HTTPS_PROXY=http://host.docker.internal:8888
```

## CLI Commands

```bash
# Start with custom ports
adl start --proxy-port 9999 --web-port 4444

# Initialize config file
adl init

# View recent logs in terminal
adl logs -n 50

# Follow logs in real-time
adl logs -f
```

## Configuration

Create a `.env` file in your project:

```env
# Proxy Settings
PROXY_PORT=8888
WEB_UI_PORT=3333

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Target Services (comma separated)
MONITORED_HOSTS=accounts.google.com,api.stripe.com,api.twitter.com,graph.facebook.com

# Authentication Patterns
AUTH_ENDPOINTS=/oauth,/auth,/token,/login,/signin,/signup

# UI Settings
AUTO_OPEN_BROWSER=true
```

## Dashboard Features

- **Real-time Updates**: See requests as they happen
- **Filtering**: Filter by service (Google, Stripe, etc.) or status code
- **Search**: Search through request/response bodies
- **Export**: Download logs as JSON for further analysis
- **Detail View**: Click any request to see full details

## Log Files

Logs are saved in the `./logs` directory:
- `auth-YYYY-MM-DD.json`: Daily auth logs in JSON format
- `auth-debug.log`: General application logs
- `error.log`: Error logs only

## Supported Services

Out of the box monitoring for:
- Google OAuth / Google APIs
- Stripe API
- Twitter/X API
- Facebook Graph API
- Any OAuth 2.0 flow
- Any endpoint matching auth patterns

## 🔒 Security & Privacy

### ✅ Safe to Use
- **No API keys required** - Works immediately
- **No permanent storage** - Logs are temporary (memory only)
- **HTTPS encrypted** - All communications are secure
- **Open source** - Audit the code yourself

### ⚠️ Best Practices
- **Don't send real secrets** - Sanitize sensitive data before logging
- **Development only** - Not for production use
- **Private instances recommended** - Deploy your own for sensitive debugging

### Data Handling
- Vercel deployment: Logs stored in temporary memory only
- Local deployment: Logs stored in `/tmp` directory
- No database or persistent storage
- Logs cleared on restart

## Troubleshooting

### Proxy not intercepting requests
- Ensure `HTTP_PROXY` and `HTTPS_PROXY` are set
- Some libraries ignore proxy settings - check their documentation

### Dashboard not updating
- Check WebSocket connection in browser console
- Ensure ports 8888 and 3333 are not in use

### Permission errors
- Use `sudo` for global npm install if needed
- Check write permissions for log directory

## Contributing

Contributions welcome! Please open an issue or PR on GitHub.

## Who Can Use This?

- **Individual Developers**: Perfect for debugging your own projects
- **Development Teams**: Each member can deploy their own instance
- **Open Source Projects**: Free to use and modify
- **Commercial Projects**: Yes, MIT licensed!

## License

MIT License - feel free to use in your projects!

## Contributors

Built by [@daiokawa](https://github.com/daiokawa) for the developer community.
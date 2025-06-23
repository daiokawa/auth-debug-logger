# Auth Debug Logger

A real-time debugging tool for monitoring authentication flows from OAuth providers and API services. Perfect for developers who need to debug authentication issues in production or development environments.

🚀 **Live Demo**: [https://auth-debug-logger.vercel.app](https://auth-debug-logger.vercel.app)

## Why Auth Debug Logger?

Debugging authentication flows can be challenging, especially when dealing with:
- OAuth redirects that happen outside your application
- Webhook events from services like Stripe
- Authentication errors that only occur in production
- Complex authentication flows involving multiple services

Auth Debug Logger provides a real-time web dashboard that captures and displays authentication events as they happen, making it easy to identify and fix authentication issues.

## ✨ Features

- **Real-time Monitoring**: See authentication events as they happen
- **Multi-Service Support**: Google OAuth, Stripe, Twitter, Facebook, and custom services
- **Advanced Filtering**: Filter by service, status code, or search terms
- **Detailed Inspection**: View full request/response data, headers, and payloads
- **Export Capabilities**: Download logs as JSON for further analysis
- **Secure by Design**: Uses Clerk for authentication and secure API access
- **Responsive UI**: Works on desktop and mobile devices

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/KoichiOkawa/auth-debug-logger.git
cd auth-debug-logger/auth-debug-logger-web
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file:

```env
# Clerk Configuration (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional: Custom sign-in/up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Set up Database

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit <http://localhost:3000> to see the dashboard.

## 📖 Documentation

For detailed setup instructions, deployment guides, and troubleshooting, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

## API Reference

### `GET /api/logs`
Retrieve recent authentication logs.

**Query Parameters:**
- `limit` (optional): Number of logs to return (default: 100, max: 1000)

**Response:**
```json
[
  {
    "id": "log_123",
    "timestamp": "2024-01-01T00:00:00Z",
    "service": "google",
    "endpoint": "/oauth/callback",
    "method": "GET",
    "statusCode": 200,
    "requestBody": {},
    "responseBody": {},
    "headers": {},
    "queryParams": {},
    "error": null,
    "metadata": {}
  }
]
```

### `POST /api/logs`
Submit a new authentication log entry.

**Request Body:**
```json
{
  "service": "stripe",
  "endpoint": "/webhook",
  "method": "POST",
  "statusCode": 200,
  "requestBody": {},
  "responseBody": {},
  "headers": {},
  "queryParams": {},
  "error": null,
  "metadata": {}
}
```

**Response:**
```json
{
  "id": "log_124",
  "timestamp": "2024-01-01T00:00:01Z",
  ...rest of log entry
}
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKoichiOkawa%2Fauth-debug-logger&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY&envDescription=Required%20Clerk%20authentication%20keys&envLink=https%3A%2F%2Fclerk.com%2Fdocs)

1. Click the button above
2. Add your Clerk environment variables
3. Deploy!

### Manual Deployment

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed deployment instructions for:
- Vercel
- Railway
- Self-hosted options

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS v3
- **Authentication**: Clerk
- **Database**: Prisma with SQLite (local) or PostgreSQL (production)
- **Deployment**: Optimized for Vercel

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [Clerk](https://clerk.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by developers, for developers.
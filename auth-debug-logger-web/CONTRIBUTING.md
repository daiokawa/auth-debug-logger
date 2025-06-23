# Contributing to Auth Debug Logger

First off, thank you for considering contributing to Auth Debug Logger! It's people like you that make Auth Debug Logger such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct: be respectful and considerate to others.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible using the issue template.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows the existing code style
6. Issue that pull request!

## Development Setup

1. Fork and clone the repo
   ```bash
   git clone https://github.com/your-username/auth-debug-logger.git
   cd auth-debug-logger/auth-debug-logger-web
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Clerk keys
   ```

4. Set up the database
   ```bash
   npx prisma db push
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

## Style Guide

* Use TypeScript for all new code
* Follow the existing code style (Prettier is configured)
* Write meaningful commit messages
* Add comments for complex logic
* Update documentation for any API changes

## Testing

Run the test suite before submitting a PR:

```bash
npm test
npm run lint
npm run type-check
```

## Documentation

* Update the README.md if you change functionality
* Update SETUP_GUIDE.md for any setup/deployment changes
* Comment your code where necessary
* Update TypeScript types and interfaces

Thank you for contributing!
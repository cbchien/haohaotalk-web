# HaoHaoTalk Web

A mobile-first React TypeScript application for practicing real-life conversations with AI characters. Features Chinese/English bilingual support, PWA capabilities, and Google OAuth authentication.

## Features

- 🗣️ AI-powered conversation practice scenarios
- 🌐 Bilingual support (Chinese/English)  
- 📱 Mobile-first responsive design
- 🔐 Google OAuth + email authentication
- 👤 Guest mode for quick access
- 📊 Progressive Web App (PWA) support

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build
```

## Development Scripts

```bash
npm run dev          # Start development server on port 3000
npm run build        # Build for production
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## Deployment

### Environment Variables

```bash
# Required for production
VITE_API_BASE_URL=https://api.haohaotalk.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

## Documentation

Detailed documentation available in `/docs`:

- [API Integration Guide](./docs/api-integration.md) - Service layer, error handling, authentication flows
- [State Management](./docs/state-management.md) - Zustand stores, persistence patterns
- [Deployment Guide](./docs/deployment.md) - Environment setup, platform deployment, PWA configuration

## Project Structure

```
src/
├── components/     # UI components  
├── screens/        # Page components
├── store/          # Zustand stores
├── services/       # API services
├── utils/          # Utilities & translations
└── types/          # TypeScript types
```

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + Zustand + React Router
- Google OAuth + PWA + ESLint + Prettier
# Zenith Core / Fadl Dashboard

A comprehensive, secure, cross-platform personal dashboard that serves as the central hub for all your projects, tools, and personal life management. Fully integrated with VPN/proxy infrastructure and PostgreSQL central database.

## 🎯 Project Overview

**Zenith Core / Fadl Dashboard** is your personal operating system - a modular, privacy-first platform that combines project management, note-taking, file organization, analytics, and app integration into a single, powerful interface.

### ✨ Key Features

- **🔐 Privacy-First**: All traffic routed through your VPN/proxy
- **📱 Cross-Platform**: Web, mobile, and desktop applications
- **🗄️ Self-Hosted**: Complete control over your data
- **🧩 Modular Design**: Add/remove features as needed
- **⚡ Real-Time Sync**: Seamless synchronization across devices
- **🤖 AI Integration**: Smart suggestions and automation
- **📊 Analytics**: Comprehensive productivity insights

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- VPN/proxy server (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fadl-dashboard.git
   cd fadl-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
fadl-dashboard/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── modules/               # Feature modules
│   ├── tasks/            # Task management
│   ├── notes/            # Note-taking system
│   ├── projects/         # Project management
│   ├── analytics/        # Analytics & metrics
│   ├── files/            # File management
│   └── apps/             # App launcher
├── api/                   # API routes
├── database/              # Database schemas & migrations
├── mobile/                # React Native app
├── docs/                  # Documentation
├── DOCUMENTATION.md       # Comprehensive documentation
└── TODO.md               # Development todo list
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Components**: shadcn/ui component library
- **State Management**: Zustand
- **TypeScript**: Full type safety

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.io

### Mobile & Desktop
- **Mobile**: React Native
- **Desktop**: Electron
- **Cross-platform**: Shared business logic

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:api          # Start API server
npm run dev:mobile       # Start mobile development

# Building
npm run build            # Build for production
npm run build:mobile     # Build mobile app
npm run build:desktop    # Build desktop app

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run test:mobile      # Run mobile tests

# Linting & Formatting
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fadl_dashboard"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# VPN/Proxy (Optional)
VPN_ENABLED=true
VPN_SERVER="your-vpn-server.com"
VPN_PORT=1194

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="50MB"

# External Services
OPENAI_API_KEY="your-openai-key"  # For AI features
```

## 📚 Documentation

- **[Comprehensive Documentation](./DOCUMENTATION.md)** - Complete technical documentation
- **[Development Todo List](./TODO.md)** - Detailed development roadmap
- **[API Documentation](./docs/api.md)** - API endpoints and schemas
- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions

## 🎨 Design System

The project uses a custom design system built on Tailwind CSS:

- **Colors**: Light and dark mode support
- **Typography**: Inter (primary), Playfair Display (headings)
- **Components**: Consistent, accessible UI components
- **Responsive**: Mobile-first design approach

## 🔒 Security & Privacy

- **VPN Integration**: All traffic routed through your VPN
- **Encryption**: End-to-end encryption for sensitive data
- **Self-Hosted**: Complete control over your infrastructure
- **No Tracking**: No third-party analytics or tracking
- **Data Sovereignty**: Your data stays on your servers

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build production image
docker build -t fadl-dashboard .
docker run -p 3000:3000 fadl-dashboard
```

### Manual Deployment

1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the application: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [DOCUMENTATION.md](./DOCUMENTATION.md) file
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🗺️ Roadmap

See the [TODO.md](./TODO.md) file for the complete development roadmap and current progress.

---

**Built with ❤️ for personal productivity and data sovereignty.**

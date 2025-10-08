# Zenith Core / Fadl Dashboard - Configuration Guide

## 🗄️ **Database Setup (Centralized Dockerized PostgreSQL)**

### 1. **Database Connection Configuration**

Create a `.env.local` file in your project root with the following configuration:

```bash
# Database Configuration
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=fadl_dashboard
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_SSL=true
```

### 2. **Docker PostgreSQL Setup**

If you need to set up a new PostgreSQL database:

```bash
# Create a docker-compose.yml file
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: fadl-dashboard-db
    environment:
      POSTGRES_DB: fadl_dashboard
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your-secure-password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - fadl-network

volumes:
  postgres_data:

networks:
  fadl-network:
    driver: bridge
```

### 3. **Database Initialization**

The database will be automatically initialized when you start the application. The schema includes:

- **Users**: User accounts and preferences
- **Projects**: Project management
- **Tasks**: Task management with dependencies
- **Notes**: Note-taking system
- **Files**: File metadata and references
- **Analytics**: Metrics and insights

## 📁 **File System Integration (Brain Server Directory)**

### 1. **Local Directory Configuration**

Update your `.env.local` file:

```bash
# Local File System Configuration
BRAIN_SERVER_PATH=/path/to/your/brain-server
ALLOWED_PATHS=/brain-server/media,/brain-server/documents,/brain-server/logs,/brain-server/database
```

### 2. **Directory Structure**

Your `brain-server` directory should be structured like this:

```
brain-server/
├── media/           # Images, videos, audio files
├── documents/       # PDFs, Word docs, presentations
├── logs/           # Application logs, system logs
└── database/       # Database files, backups
```

### 3. **Security Configuration**

The file system integration is secured to only access allowed paths. You can modify the allowed paths in the API routes if needed.

## 🔐 **VPN/Proxy Integration**

### 1. **VPN Configuration**

Add to your `.env.local`:

```bash
# VPN/Proxy Configuration
VPN_ENABLED=true
VPN_HOST=your-vpn-host.com
VPN_PORT=1194
VPN_USERNAME=your-vpn-username
VPN_PASSWORD=your-vpn-password
```

### 2. **Proxy Configuration**

For HTTP/HTTPS proxy:

```bash
# Proxy Configuration
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=https://your-proxy:port
NO_PROXY=localhost,127.0.0.1
```

## 🚀 **Getting Started**

### 1. **Install Dependencies**

```bash
npm install
npm install pg @types/pg
```

### 2. **Set Up Environment**

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. **Initialize Database**

```bash
npm run db:init
```

### 4. **Start Development Server**

```bash
npm run dev
```

## 🔧 **API Endpoints**

### File System API

- `GET /api/files/local?path=/brain-server/media` - List directory contents
- `GET /api/files/local/content?path=/brain-server/media/image.jpg` - Get file content
- `GET /api/files/local/metadata?path=/brain-server/media/image.jpg` - Get file metadata
- `GET /api/files/local/search?query=document&directory=/brain-server/documents` - Search files

### Database API

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/notes` - List notes
- `POST /api/notes` - Create note

## 🛡️ **Security Considerations**

1. **File System Access**: Only allowed paths are accessible
2. **Database Security**: Use SSL connections and strong passwords
3. **VPN Integration**: All external traffic routed through VPN
4. **Authentication**: JWT-based authentication system
5. **Input Validation**: All inputs are validated and sanitized

## 📱 **Mobile & Desktop Integration**

The file system integration works across all platforms:

- **Web**: Direct file system access through API
- **Mobile**: Cached file access with sync
- **Desktop**: Direct file system integration

## 🔄 **Sync & Backup**

1. **Real-time Sync**: File changes are detected and synced
2. **Database Backup**: Automated daily backups
3. **File Backup**: Incremental file synchronization
4. **Version Control**: File versioning and history

## 🚨 **Troubleshooting**

### Database Connection Issues

```bash
# Test database connection
npm run db:test

# Check database status
docker ps | grep postgres
```

### File System Access Issues

```bash
# Check file permissions
ls -la /path/to/brain-server

# Test API endpoint
curl http://localhost:3000/api/files/local?path=/brain-server/media
```

### VPN Connection Issues

```bash
# Test VPN connection
ping your-vpn-host.com

# Check proxy settings
echo $HTTP_PROXY
```

## 📞 **Support**

If you encounter any issues:

1. Check the logs in the browser console
2. Check the server logs in the terminal
3. Verify your configuration in `.env.local`
4. Test individual API endpoints
5. Check database and file system permissions

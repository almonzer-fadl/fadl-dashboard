# 🚀 Zenith Core / Fadl Dashboard - Complete Setup Guide

## 📋 **Overview**

This guide will help you set up the Zenith Core / Fadl Dashboard with:
- ✅ **Local File System Integration** - Direct access to your `brain-server` directory
- ✅ **Centralized PostgreSQL Database** - Dockerized database with VPN/proxy access
- ✅ **Cross-Platform Support** - Web, mobile, and desktop access

---

## 🗄️ **Database Setup (Centralized Dockerized PostgreSQL)**

### **Option 1: Use Existing Database**

If you already have a PostgreSQL database:

1. **Create `.env.local` file:**
```bash
# Database Configuration
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=fadl_dashboard
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_SSL=true
```

2. **Test connection:**
```bash
npm run db:test
```

3. **Initialize database:**
```bash
npm run db:init
```

### **Option 2: Create New Docker Database**

1. **Create `docker-compose.yml`:**
```yaml
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
    networks:
      - fadl-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  fadl-network:
    driver: bridge
```

2. **Start database:**
```bash
docker-compose up -d
```

3. **Configure environment:**
```bash
# Add to .env.local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fadl_dashboard
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_SSL=false
```

4. **Initialize database:**
```bash
npm run db:init
```

---

## 📁 **File System Integration (Brain Server Directory)**

### **1. Set Up Brain Server Directory**

Create your `brain-server` directory structure:

```bash
mkdir -p /path/to/brain-server/{media,documents,logs,database}
```

**Example structure:**
```
brain-server/
├── media/           # Images, videos, audio files
│   ├── photos/
│   ├── videos/
│   └── music/
├── documents/       # PDFs, Word docs, presentations
│   ├── work/
│   ├── personal/
│   └── projects/
├── logs/           # Application logs, system logs
│   ├── app/
│   ├── system/
│   └── errors/
└── database/       # Database files, backups
    ├── backups/
    ├── exports/
    └── schemas/
```

### **2. Configure File System Access**

Add to your `.env.local`:

```bash
# Local File System Configuration
BRAIN_SERVER_PATH=/path/to/your/brain-server
ALLOWED_PATHS=/brain-server/media,/brain-server/documents,/brain-server/logs,/brain-server/database
```

### **3. Set Permissions**

Ensure the application can read your files:

```bash
# Make sure the directory is readable
chmod -R 755 /path/to/brain-server

# If running as different user, adjust ownership
sudo chown -R $USER:$USER /path/to/brain-server
```

---

## 🔐 **VPN/Proxy Integration**

### **1. VPN Configuration**

Add to your `.env.local`:

```bash
# VPN/Proxy Configuration
VPN_ENABLED=true
VPN_HOST=your-vpn-host.com
VPN_PORT=1194
VPN_USERNAME=your-vpn-username
VPN_PASSWORD=your-vpn-password
```

### **2. Proxy Configuration**

For HTTP/HTTPS proxy:

```bash
# Add to .env.local
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=https://your-proxy:port
NO_PROXY=localhost,127.0.0.1
```

### **3. Test VPN/Proxy Connection**

```bash
# Test VPN connection
ping your-vpn-host.com

# Test proxy settings
curl -I http://httpbin.org/ip
```

---

## 🚀 **Installation & Setup**

### **1. Install Dependencies**

```bash
# Install Node.js dependencies
npm install

# Install additional dependencies for database
npm install pg @types/pg dotenv
```

### **2. Environment Configuration**

Create `.env.local` file:

```bash
# Copy the example
cp .env.example .env.local

# Edit with your configuration
nano .env.local
```

**Complete `.env.local` example:**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fadl_dashboard
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_SSL=false

# Local File System Configuration
BRAIN_SERVER_PATH=/path/to/your/brain-server
ALLOWED_PATHS=/brain-server/media,/brain-server/documents,/brain-server/logs,/brain-server/database

# VPN/Proxy Configuration
VPN_ENABLED=true
VPN_HOST=your-vpn-host.com
VPN_PORT=1194
VPN_USERNAME=your-vpn-username
VPN_PASSWORD=your-vpn-password

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-32-character-encryption-key
SESSION_SECRET=your-session-secret-key

# Application Configuration
NODE_ENV=development
PORT=3000
```

### **3. Initialize Database**

```bash
# Test database connection
npm run db:test

# Initialize database schema
npm run db:init

# (Optional) Insert sample data
INSERT_SAMPLE_DATA=true npm run db:init
```

### **4. Start Development Server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see your dashboard!

---

## 🔧 **API Endpoints**

### **File System API**

- `GET /api/files/local?path=/brain-server/media` - List directory contents
- `GET /api/files/local/content?path=/brain-server/media/image.jpg` - Get file content
- `GET /api/files/local/metadata?path=/brain-server/media/image.jpg` - Get file metadata
- `GET /api/files/local/search?query=document&directory=/brain-server/documents` - Search files

### **Database API**

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/notes` - List notes
- `POST /api/notes` - Create note

---

## 🛡️ **Security Features**

### **File System Security**
- ✅ **Path Validation**: Only allowed paths are accessible
- ✅ **Permission Checks**: File system permissions are respected
- ✅ **MIME Type Validation**: Only safe file types are served
- ✅ **Size Limits**: File size limits prevent abuse

### **Database Security**
- ✅ **SSL Connections**: Encrypted database connections
- ✅ **Parameterized Queries**: SQL injection prevention
- ✅ **Connection Pooling**: Efficient resource management
- ✅ **Access Control**: User-based data isolation

### **Network Security**
- ✅ **VPN Integration**: All external traffic routed through VPN
- ✅ **Proxy Support**: HTTP/HTTPS proxy configuration
- ✅ **CORS Protection**: Cross-origin request protection
- ✅ **Rate Limiting**: API rate limiting (coming soon)

---

## 📱 **Cross-Platform Access**

### **Web Application**
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **PWA Support**: Install as web app
- ✅ **Offline Support**: Local caching and sync

### **Mobile App** (Coming Soon)
- ✅ **React Native**: Native mobile experience
- ✅ **Offline Sync**: Local storage with cloud sync
- ✅ **Push Notifications**: Real-time updates

### **Desktop App** (Coming Soon)
- ✅ **Electron**: Native desktop application
- ✅ **System Integration**: File system and notifications
- ✅ **Auto-updater**: Automatic updates

---

## 🔄 **Sync & Backup**

### **Real-time Sync**
- ✅ **File Watching**: Automatic file change detection
- ✅ **Database Sync**: Real-time database updates
- ✅ **Conflict Resolution**: Smart conflict handling

### **Backup Strategy**
- ✅ **Database Backups**: Daily automated backups
- ✅ **File Backups**: Incremental file synchronization
- ✅ **Version Control**: File versioning and history
- ✅ **Disaster Recovery**: Complete system restoration

---

## 🚨 **Troubleshooting**

### **Database Issues**

```bash
# Test database connection
npm run db:test

# Check database status
docker ps | grep postgres

# View database logs
docker logs fadl-dashboard-db

# Reset database
npm run db:reset
```

### **File System Issues**

```bash
# Check file permissions
ls -la /path/to/brain-server

# Test API endpoint
curl "http://localhost:3000/api/files/local?path=/brain-server/media"

# Check allowed paths
echo $ALLOWED_PATHS
```

### **VPN/Proxy Issues**

```bash
# Test VPN connection
ping your-vpn-host.com

# Check proxy settings
echo $HTTP_PROXY
echo $HTTPS_PROXY

# Test external connectivity
curl -I http://httpbin.org/ip
```

### **Application Issues**

```bash
# Check application logs
npm run dev

# Check environment variables
node -e "console.log(process.env.DB_HOST)"

# Test API endpoints
curl http://localhost:3000/api/projects
```

---

## 📞 **Support & Next Steps**

### **Immediate Next Steps**
1. ✅ Set up your `brain-server` directory
2. ✅ Configure database connection
3. ✅ Test file system access
4. ✅ Start using the dashboard!

### **Advanced Features** (Coming Soon)
- 🤖 **AI Integration**: Smart content analysis
- 📊 **Advanced Analytics**: Detailed insights
- 🔗 **Third-party Integrations**: Calendar, email, etc.
- 📱 **Mobile App**: Native mobile experience

### **Getting Help**
- 📖 **Documentation**: Check `DOCUMENTATION.md`
- 🔧 **Configuration**: Check `CONFIGURATION.md`
- 🐛 **Issues**: Check browser console and server logs
- 💬 **Support**: Create an issue in the repository

---

## 🎉 **You're Ready!**

Your Zenith Core / Fadl Dashboard is now set up with:
- ✅ **Local File Access**: Direct access to your `brain-server` directory
- ✅ **Centralized Database**: PostgreSQL with full schema
- ✅ **VPN/Proxy Integration**: Secure external access
- ✅ **Cross-Platform**: Web, mobile, and desktop ready

**Start exploring your personal productivity hub!** 🚀

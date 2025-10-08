#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script initializes the PostgreSQL database with the required schema
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fadl_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(dbConfig);

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing database...');
    
    // Test connection
    await client.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Create tables
    console.log('📋 Creating tables...');
    
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');

    // Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Projects table created');

    // Tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'todo',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date TIMESTAMP,
        completed_at TIMESTAMP,
        parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tasks table created');

    // Task dependencies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS task_dependencies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        depends_on UUID REFERENCES tasks(id) ON DELETE CASCADE,
        type VARCHAR(20) DEFAULT 'blocked_by',
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Task dependencies table created');

    // Notes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[] DEFAULT '{}',
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Notes table created');

    // Note templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS note_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'Personal',
        tags TEXT[] DEFAULT '{}',
        is_starred BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Note templates table created');

    // Files table
    await client.query(`
      CREATE TABLE IF NOT EXISTS files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size BIGINT NOT NULL,
        path TEXT NOT NULL,
        local_path TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Files table created');

    // Analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(10,2) NOT NULL,
        metric_data JSONB DEFAULT '{}',
        recorded_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Analytics table created');

    // Create indexes for better performance
    console.log('🔍 Creating indexes...');
    
    await client.query('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_analytics_metric_name ON analytics(metric_name);');
    
    console.log('✅ Indexes created');

    // Insert sample data (optional)
    if (process.env.INSERT_SAMPLE_DATA === 'true') {
      console.log('📊 Inserting sample data...');
      
      // Create a sample user
      const userResult = await client.query(`
        INSERT INTO users (email, password_hash, name) 
        VALUES ('demo@example.com', '$2b$10$example', 'Demo User')
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
      `);
      
      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id;
        
        // Create sample project
        const projectResult = await client.query(`
          INSERT INTO projects (user_id, name, description, status, priority) 
          VALUES ($1, 'Sample Project', 'A sample project for testing', 'active', 'high')
          RETURNING id;
        `, [userId]);
        
        if (projectResult.rows.length > 0) {
          const projectId = projectResult.rows[0].id;
          
          // Create sample tasks
          await client.query(`
            INSERT INTO tasks (project_id, user_id, title, description, status, priority) 
            VALUES 
              ($1, $2, 'Sample Task 1', 'First sample task', 'todo', 'medium'),
              ($1, $2, 'Sample Task 2', 'Second sample task', 'in-progress', 'high');
          `, [projectId, userId]);
          
          // Create sample note
          await client.query(`
            INSERT INTO notes (user_id, title, content, tags) 
            VALUES ($1, 'Welcome Note', 'Welcome to your personal dashboard!', ARRAY['welcome', 'getting-started']);
          `, [userId]);
        }
      }
      
      console.log('✅ Sample data inserted');
    }

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection test successful:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  try {
    console.log('🔧 Zenith Core / Fadl Dashboard - Database Setup');
    console.log('================================================');
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('\n💡 Make sure your database is running and configuration is correct.');
      console.log('   Check your .env.local file for database settings.');
      process.exit(1);
    }
    
    // Initialize database
    await initializeDatabase();
    
    console.log('\n🚀 You can now start the application with: npm run dev');
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { initializeDatabase, testConnection };

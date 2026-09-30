const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test DB connection before starting server
const startServer = async () => {
  try {
    if (process.env.DATABASE_URL) {
      await pool.query('SELECT NOW()');
      console.log('Database connected successfully.');
    } else {
      console.warn('WARNING: DATABASE_URL is not set. Running without DB validation.');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

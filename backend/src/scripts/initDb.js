const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const initDb = async () => {
  try {
    const sqlPath = path.join(__dirname, '../../database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running database schema creation...');
    await pool.query(sql);
    console.log('Database tables created successfully.');
    
    // Seed some initial data
    await pool.query(`
      INSERT INTO departments (name, description) VALUES 
      ('IT', 'Information Technology Department'),
      ('HR', 'Human Resources Department'),
      ('FINANCE', 'Finance and Accounting'),
      ('ADMINISTRATION', 'General Administration')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Initial departments seeded.');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDb();

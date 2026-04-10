import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cse340',
  password: 'password',   // 
  port: 5432,
});

// test connection function
export const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
};

export default {
  query: (text, params) => pool.query(text, params),
};
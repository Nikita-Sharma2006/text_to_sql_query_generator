import mysql from 'mysql2/promise';

let pool = null;

/**
 * Initialize and get the MySQL connection pool
 */
export const getMySQLPool = () => {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const database = process.env.MYSQL_DATABASE;

  // Verify basic settings exist
  if (!host || !user || !database) {
    return null;
  }

  try {
    pool = mysql.createPool({
      host: host,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: user,
      password: process.env.MYSQL_PASSWORD || '',
      database: database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    return pool;
  } catch (err) {
    console.error(`[MySQL Error] Pool initialization failed: ${err.message}`);
    return null;
  }
};

/**
 * Check if MySQL settings are present in the environment
 */
export const isMySQLConfigured = () => {
  return getMySQLPool() !== null;
};

/**
 * Execute a raw SQL query safely and return results
 */
export const executeMySQLQuery = async (sql, params = []) => {
  const connectionPool = getMySQLPool();
  if (!connectionPool) {
    throw new Error('MySQL coordinates are not configured in environment scrolls (.env).');
  }

  const [rows, fields] = await connectionPool.execute(sql, params);
  return { rows, fields };
};

import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Cloud databases need an encrypted connection using their CA certificate.
  ssl: process.env.DB_CA_CERT ? { ca: process.env.DB_CA_CERT } : undefined,
  dateStrings: true, // return dates as "2026-10-30" instead of JS Date objects
})

// Create the tables the first time the server starts.
export async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS threads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      thread_id INT NOT NULL,
      role ENUM('user', 'assistant') NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      thread_id INT,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      service VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      time CHAR(5) NOT NULL,
      status ENUM('booked', 'cancelled') NOT NULL DEFAULT 'booked',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE SET NULL
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      thread_id INT,
      name VARCHAR(100) NOT NULL,
      contact VARCHAR(150) NOT NULL,
      reason TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE SET NULL
    )
  `)
}

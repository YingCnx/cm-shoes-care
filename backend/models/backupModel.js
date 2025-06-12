import pool from "../db.js"

export const logBackup = async (filename) => {
  const timestamp = new Date().toISOString()
  await pool.query(
    "INSERT INTO backup_logs (filename, created_at) VALUES ($1, $2)",
    [filename, timestamp]
  )
}

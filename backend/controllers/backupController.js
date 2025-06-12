import { exec } from "child_process"
import path from "path"
import fs from "fs"

export const handleDatabaseBackup = (req, res) => {
  const filename = `backup-${new Date().toISOString().slice(0, 10)}.dump`
  const backupDir = path.join("backups")
  const filePath = path.join(backupDir, filename)

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }

  const connectionString = process.env.PG_CONN_STRING // ✅ ใช้จาก .env

  const cmd = `pg_dump "${connectionString}" -F c -f "${filePath}"`

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Backup failed:", stderr)
      return res.status(500).json({ error: "Backup failed", detail: stderr })
    }

    res.download(filePath)
  })
}

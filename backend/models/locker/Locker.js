import pool from '../../config/database.js';

class Locker {
  static async getLockerByCode(lockerCode) {
    const result = await pool.query(
      `SELECT id AS locker_id, branch_id, secret_key FROM lockers WHERE code = $1`,
      [lockerCode]
    );

    if (result.rowCount === 0) return null;

    return result.rows[0]; // { locker_id, branch_id, secret_key }
  }
}

export default Locker;

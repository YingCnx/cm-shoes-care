import pool from "../../config/database.js";

class LockerDrop {
  static async getPendingByBranch(branch_id) {
    const result = await pool.query(`
    SELECT 
        t.id, 
        t.phone, 
        t.total_pairs,
        t.branch_id, 
        t.locker_id, 
        l.name AS locker_name, 
        t.slot_id, 
        s.slot_number, 
        t.slot_type, 
        t.status, 
        t.created_at, 
        t.updated_at, 
        t.queue_id
    FROM 
        transactions t
    LEFT JOIN 
        lockers l ON t.locker_id = l.id
    LEFT JOIN 
        locker_slots s ON t.slot_id = s.id
    WHERE 
        t.branch_id = $1 AND t.status = 'dropped'
    ORDER BY 
        t.locker_id
    `, [branch_id]);

    return result.rows;
  }

  static async updateStatusById(id, status) {
    const result = await pool.query(`
      UPDATE locker_drop
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    return result.rows[0];
  }

  static async getById(id) {
    const result = await pool.query(`
      SELECT ld.*, t.phone, l.name AS locker_name, s.slot_number
      FROM locker_drop ld
      JOIN transactions t ON ld.transaction_id = t.id
      JOIN lockers l ON ld.locker_id = l.id
      JOIN locker_slots s ON ld.slot_id = s.id
      WHERE ld.id = $1
    `, [id]);

    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(`
    SELECT *
      FROM locker_drop
      ORDER BY locker_drop.created_at DESC
    `);

    return result.rows;
  }

static async updateLockerDropWithImage(id, status, imageUrl) {
  const result = await pool.query(`
    UPDATE locker_drop
    SET status = $1, proof_image_url = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `, [status, imageUrl, id]);

  return result.rows[0];
}


  static async create({ customer_id, transaction_id, locker_id, slot_id, proof_image_url,total_pairs }) {
    const result = await pool.query(`
      INSERT INTO locker_drop (
        customer_id, transaction_id, locker_id, slot_id,
        status, proof_image_url, created_at, updated_at,total_pairs
      )
      VALUES ($1, $2, $3, $4, 'received', $5, NOW(), NOW(), $6)
      RETURNING *
    `, [customer_id, transaction_id, locker_id, slot_id, proof_image_url,total_pairs]);

    return result.rows[0];
  }

static async getUnqueuedByBranch(branch_id) {
  const result = await pool.query(`
 SELECT 
      ld.id,
	  c.id AS customer_id,
	  c.name AS customer_name,
      t.phone,
	  ld.locker_id,
	  ld.slot_id,
      l.name AS locker_name,
      s.slot_number,
      ld.total_pairs,
      ld.status,
      ld.queue_id
    FROM locker_drop ld
    JOIN transactions t ON ld.transaction_id = t.id
    JOIN customers c ON t.phone = c.phone
    JOIN lockers l ON ld.locker_id = l.id
    JOIN locker_slots s ON ld.slot_id = s.id
    WHERE t.branch_id = $1
      AND ld.queue_id IS NULL
    ORDER BY ld.created_at DESC, ld.locker_id ASC
  `, [branch_id]);

  return result.rows;
}

static async updateQueueId(id, queue_id) {
  const result = await pool.query(
    `UPDATE locker_drop SET queue_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [queue_id, id]
  );
  return result.rows[0];
}

}




export default LockerDrop;

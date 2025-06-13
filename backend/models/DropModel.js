import pool from '../config/database.js';

export const insertTransaction = async ({
  phone,
  branch_id,
  locker_id,
  slot_id,
  slot_type
}) => {
  const result = await pool.query(
    `INSERT INTO transactions (phone, branch_id, locker_id, slot_id, slot_type, status)
     VALUES ($1, $2, $3, $4, $5, 'dropped') RETURNING *`,
    [phone, branch_id, locker_id, slot_id, slot_type]
  );
  return result.rows[0];
};

export const insertLockerDrop = async ({
  transaction_id,
  locker_id,
  slot_id,
  service_type,
  total_pairs
}) => {
  await pool.query(
    `INSERT INTO locker_drop (transaction_id, locker_id, slot_id, status, service_type, total_pairs)
     VALUES ($1, $2, $3, 'pending_pickup', $4, $5)`,
    [transaction_id, locker_id, slot_id, service_type, total_pairs]
  );
};

export const updateSlotStatus = async (slot_id) => {
  await pool.query(
    `UPDATE locker_slots SET status = 'used' WHERE id = $1`,
    [slot_id]
  );
};

export const findAvailableSlot = async (locker_id) => {
  const result = await pool.query(
    `SELECT id, locker_id, slot_number 
     FROM locker_slots 
     WHERE status = 'available' AND locker_id = $1
     ORDER BY slot_number ASC 
     LIMIT 1`,
    [locker_id]
  );
  return result.rows[0] || null;
};

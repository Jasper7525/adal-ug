import { query } from '../db/postgres.js';

export async function createOrder(req, res) {
  const { customerName, customerPhone, cylinderCode, quantity, deliveryZone } = req.body || {};
  if (!customerName || !customerPhone || !cylinderCode || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
    return res.status(400).json({ message: 'Customer name, phone, product and a valid quantity are required.' });
  }
  try {
    if (!process.env.DATABASE_URL) return res.status(201).json({ success: true, message: 'Order accepted in demo mode. Configure PostgreSQL to persist orders.', order: { customerName, customerPhone, cylinderCode, quantity: Number(quantity), deliveryZone, status: 'new' } });
    const result = await query(`INSERT INTO adal_orders (customer_name, customer_phone, cylinder_code, quantity, delivery_zone, status) VALUES ($1,$2,$3,$4,$5,'new') RETURNING *`, [customerName, customerPhone, cylinderCode, Number(quantity), deliveryZone]);
    return res.status(201).json({ success: true, message: 'Order saved to PostgreSQL database.', order: result.rows[0] });
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function getOrders(req, res) {
  try {
    if (!process.env.DATABASE_URL) return res.json([]);
    const result = await query('SELECT * FROM adal_orders ORDER BY created_at DESC LIMIT 200');
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function updateOrderStatus(req, res) {
  const allowed = ['new', 'confirmed', 'processing', 'dispatched', 'completed', 'cancelled'];
  const status = String(req.body?.status || '').toLowerCase();
  if (!allowed.includes(status)) return res.status(400).json({ message: `Invalid status. Use: ${allowed.join(', ')}.` });
  try {
    if (!process.env.DATABASE_URL) return res.json({ success: true, id: Number(req.params.id), status });
    const result = await query('UPDATE adal_orders SET status = $1 WHERE id = $2 RETURNING *', [status, Number(req.params.id)]);
    if (!result.rows.length) return res.status(404).json({ message: 'Order not found.' });
    return res.json({ success: true, order: result.rows[0] });
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

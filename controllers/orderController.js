import { query } from '../db/postgres.js';

export async function createOrder(req, res) {
  const { customerName, customerPhone, cylinderCode, quantity, deliveryZone } = req.body;

  try {
    if (!process.env.DATABASE_URL) {
      return res.json({
        success: true,
        message: 'Order accepted in demo mode. Configure PostgreSQL to persist orders.',
        order: {
          customerName,
          customerPhone,
          cylinderCode,
          quantity,
          deliveryZone,
          status: 'new',
        },
      });
    }

    await query(
      `INSERT INTO adal_orders (customer_name, customer_phone, cylinder_code, quantity, delivery_zone, status)
       VALUES ($1, $2, $3, $4, $5, 'new')`,
      [customerName, customerPhone, cylinderCode, quantity, deliveryZone]
    );

    return res.json({ success: true, message: 'Order saved to PostgreSQL database.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

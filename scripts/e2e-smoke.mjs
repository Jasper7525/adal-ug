import { spawn } from 'node:child_process';

const base = 'http://127.0.0.1:3001';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, options);
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { response, body };
}

const server = spawn(process.execPath, ['server.js'], { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
server.stdout.on('data', chunk => process.stdout.write(`[server] ${chunk}`));
server.stderr.on('data', chunk => process.stderr.write(`[server] ${chunk}`));

try {
  let healthy = false;
  for (let i = 0; i < 40; i += 1) {
    try {
      const result = await request('/api/health');
      if (result.response.ok) { healthy = true; break; }
    } catch {}
    await wait(250);
  }
  if (!healthy) throw new Error('API did not become ready.');

  const health = await request('/api/health');
  if (health.body?.database?.status !== 'ok') throw new Error(`Database health check failed: ${JSON.stringify(health.body)}`);

  const login = await request('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD }) });
  if (!login.response.ok || !login.body?.token) throw new Error(`Admin login failed: ${JSON.stringify(login.body)}`);
  const token = login.body.token;
  const auth = { 'x-admin-token': token };

  const products = await request('/api/products');
  if (!products.response.ok || !Array.isArray(products.body) || products.body.length < 5) throw new Error('Catalogue did not load from PostgreSQL.');

  const create = await request('/api/products', { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ code: 'E2E-TEST', name: 'E2E Test Cylinder', size: '6kg', category: '6kg', price: 12345, description: 'Temporary end-to-end test item', image_url: '' }) });
  if (create.response.status !== 201) throw new Error(`Product create failed: ${JSON.stringify(create.body)}`);
  const productId = create.body.id;

  const update = await request(`/api/products/${productId}`, { method: 'PUT', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ name: 'E2E Updated Cylinder', price: 23456, description: 'Updated by E2E test' }) });
  if (!update.response.ok || update.body.name !== 'E2E Updated Cylinder') throw new Error(`Product update failed: ${JSON.stringify(update.body)}`);

  const imageBytes = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64'));
  const imageForm = new FormData();
  imageForm.append('image', new Blob([imageBytes], { type: 'image/png' }), 'e2e.png');
  imageForm.append('productCode', 'E2E-TEST');
  imageForm.append('category', 'cylinder');
  imageForm.append('imageName', 'E2E test image');
  imageForm.append('price', '23456');
  imageForm.append('description', 'E2E upload');
  const upload = await request('/api/upload-image', { method: 'POST', headers: auth, body: imageForm });
  if (upload.response.status !== 201 || !upload.body?.image_url) throw new Error(`Image upload failed: ${JSON.stringify(upload.body)}`);

  const order = await request('/api/orders', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ customerName: 'E2E Customer', customerPhone: '0700000000', cylinderCode: 'E2E-TEST', quantity: 2, deliveryZone: 'Mbarara' }) });
  if (order.response.status !== 201) throw new Error(`Order creation failed: ${JSON.stringify(order.body)}`);

  const orders = await request('/api/admin/orders', { headers: auth });
  if (!orders.response.ok || !Array.isArray(orders.body)) throw new Error(`Admin order list failed: ${JSON.stringify(orders.body)}`);
  const createdOrder = orders.body.find(item => item.cylinder_code === 'E2E-TEST');
  if (!createdOrder) throw new Error('Created order was not found in PostgreSQL.');

  const status = await request(`/api/admin/orders/${createdOrder.id}/status`, { method: 'PATCH', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ status: 'confirmed' }) });
  if (!status.response.ok || status.body?.order?.status !== 'confirmed') throw new Error(`Order status update failed: ${JSON.stringify(status.body)}`);

  const visitors = await request('/api/admin/visitors', { headers: auth });
  if (!visitors.response.ok || !Array.isArray(visitors.body)) throw new Error(`Visitor monitoring failed: ${JSON.stringify(visitors.body)}`);

  const remove = await request(`/api/products/${productId}`, { method: 'DELETE', headers: auth });
  if (!remove.response.ok) throw new Error(`Product delete failed: ${JSON.stringify(remove.body)}`);

  console.log('E2E smoke test passed: health, PostgreSQL, admin login, product CRUD, image upload, orders, order status and visitor monitoring.');
} finally {
  server.kill('SIGTERM');
  await wait(300);
}

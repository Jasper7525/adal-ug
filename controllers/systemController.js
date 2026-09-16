import { healthCheck } from '../db/postgres.js';

export async function health(req, res) {
  const database = await healthCheck();

  res.json({
    status: 'ok',
    service: 'adal-ug-api',
    timestamp: new Date().toISOString(),
    database,
  });
}

export function requirements(req, res) {
  res.json({
    title: 'Adal Uganda User Requirements Document',
    version: '1.0',
    format: 'HTML',
    downloadUrl: '/docs/adal-uganda-user-requirements-document.html',
  });
}

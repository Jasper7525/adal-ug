import fs from 'fs';
import path from 'path';
import { query } from '../db/postgres.js';
import { uploadDir } from '../config/upload.js';

const TYPES = new Set(['news', 'staff', 'gallery', 'feature']);
const normalizeType = (value) => String(value || '').trim().toLowerCase();
const store = (app) => { if (!app.locals.contentStore) app.locals.contentStore = []; return app.locals.contentStore; };
const mediaStore = (app) => { if (!app.locals.mediaStore) app.locals.mediaStore = []; return app.locals.mediaStore; };
const mediaUrl = (filename) => `/uploads/${filename}`;
const removeFile = (url) => {
  if (!url || !String(url).startsWith('/uploads/')) return;
  const file = path.join(uploadDir, path.basename(url));
  if (fs.existsSync(file)) fs.unlinkSync(file);
};

export async function getContent(req, res) {
  try {
    const type = normalizeType(req.query.type);
    if (type && !TYPES.has(type)) return res.status(400).json({ message: 'Unsupported content type.' });
    if (!process.env.DATABASE_URL) {
      return res.json(store(req.app).filter(item => !type || item.type === type).filter(item => item.published !== false).sort((a,b) => Number(a.sort_order)-Number(b.sort_order) || new Date(b.created_at)-new Date(a.created_at)));
    }
    const params = type ? [type] : [];
    const result = await query(`SELECT id,type,title,body,image_url,metadata,sort_order,published,created_at,updated_at FROM adal_content_items ${type ? 'WHERE type=$1 AND published=true' : 'WHERE published=true'} ORDER BY sort_order ASC, created_at DESC`, params);
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function getAdminContent(req, res) {
  try {
    if (!process.env.DATABASE_URL) return res.json(store(req.app).sort((a,b) => new Date(b.created_at)-new Date(a.created_at)));
    const result = await query('SELECT id,type,title,body,image_url,metadata,sort_order,published,created_at,updated_at FROM adal_content_items ORDER BY type ASC, sort_order ASC, created_at DESC');
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function createContent(req, res) {
  try {
    const { type, title, body, image_url, imageUrl, metadata, sort_order, published } = req.body || {};
    const normalizedType = normalizeType(type);
    if (!TYPES.has(normalizedType)) return res.status(400).json({ message: 'Content type must be news, staff, gallery or feature.' });
    if (!String(title || '').trim()) return res.status(400).json({ message: 'A title is required.' });
    const data = { type: normalizedType, title: String(title).trim(), body: String(body || '').trim(), image_url: String(image_url ?? imageUrl ?? '').trim() || null, metadata: metadata && typeof metadata === 'object' ? metadata : {}, sort_order: Number.isFinite(Number(sort_order)) ? Number(sort_order) : 0, published: published !== false };
    if (!process.env.DATABASE_URL) {
      const item = { id: Math.max(0, ...store(req.app).map(x => Number(x.id))) + 1, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      store(req.app).push(item); return res.status(201).json(item);
    }
    const result = await query(`INSERT INTO adal_content_items (type,title,body,image_url,metadata,sort_order,published) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [data.type,data.title,data.body,data.image_url,JSON.stringify(data.metadata),data.sort_order,data.published]);
    return res.status(201).json(result.rows[0]);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function updateContent(req, res) {
  try {
    const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid content ID.' });
    const { type, title, body, image_url, imageUrl, metadata, sort_order, published } = req.body || {};
    const normalizedType = type === undefined ? undefined : normalizeType(type);
    if (normalizedType !== undefined && !TYPES.has(normalizedType)) return res.status(400).json({ message: 'Unsupported content type.' });
    if (!process.env.DATABASE_URL) {
      const item = store(req.app).find(x => Number(x.id) === id); if (!item) return res.status(404).json({ message: 'Content item not found.' });
      if (normalizedType !== undefined) item.type = normalizedType; if (title !== undefined) item.title = String(title).trim(); if (body !== undefined) item.body = String(body).trim();
      if (image_url !== undefined || imageUrl !== undefined) item.image_url = String(image_url ?? imageUrl ?? '').trim() || null; if (metadata !== undefined) item.metadata = metadata;
      if (sort_order !== undefined) item.sort_order = Number(sort_order) || 0; if (published !== undefined) item.published = Boolean(published); item.updated_at = new Date().toISOString(); return res.json(item);
    }
    const result = await query(`UPDATE adal_content_items SET type=COALESCE($1,type), title=COALESCE($2,title), body=COALESCE($3,body), image_url=CASE WHEN $4::boolean THEN $5 ELSE image_url END, metadata=COALESCE($6,metadata), sort_order=COALESCE($7,sort_order), published=COALESCE($8,published), updated_at=CURRENT_TIMESTAMP WHERE id=$9 RETURNING *`, [normalizedType ?? null,title !== undefined ? String(title).trim() : null,body !== undefined ? String(body).trim() : null,image_url !== undefined || imageUrl !== undefined,String(image_url ?? imageUrl ?? '').trim() || null,metadata !== undefined ? JSON.stringify(metadata) : null,sort_order !== undefined ? Number(sort_order) : null,published !== undefined ? Boolean(published) : null,id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Content item not found.' }); return res.json(result.rows[0]);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function deleteContent(req, res) {
  try {
    const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid content ID.' });
    if (!process.env.DATABASE_URL) { const items = store(req.app); const index = items.findIndex(x => Number(x.id) === id); if (index < 0) return res.status(404).json({ message: 'Content item not found.' }); items.splice(index,1); return res.json({ success:true, deletedId:id }); }
    const result = await query('DELETE FROM adal_content_items WHERE id=$1 RETURNING image_url',[id]); if (!result.rows.length) return res.status(404).json({ message:'Content item not found.' }); return res.json({ success:true, deletedId:id });
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function getMedia(req, res) {
  try {
    if (!process.env.DATABASE_URL) return res.json(mediaStore(req.app).sort((a,b) => new Date(b.uploaded_at)-new Date(a.uploaded_at)));
    const result = await query('SELECT id,image_url,image_name,mime_type,size_bytes,uploaded_at FROM adal_media ORDER BY uploaded_at DESC');
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function uploadMedia(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided.' });
    const item = { image_url: mediaUrl(req.file.filename), image_name: req.file.originalname, mime_type: req.file.mimetype, size_bytes: req.file.size };
    if (!process.env.DATABASE_URL) {
      const media = { id: Math.max(0, ...mediaStore(req.app).map(x => Number(x.id))) + 1, ...item, uploaded_at: new Date().toISOString() };
      mediaStore(req.app).push(media); return res.status(201).json(media);
    }
    const result = await query('INSERT INTO adal_media (image_url,image_name,mime_type,size_bytes) VALUES ($1,$2,$3,$4) RETURNING *',[item.image_url,item.image_name,item.mime_type,item.size_bytes]);
    return res.status(201).json(result.rows[0]);
  } catch (error) { if (req.file) removeFile(mediaUrl(req.file.filename)); return res.status(500).json({ message: error.message }); }
}

export async function deleteMedia(req, res) {
  try {
    const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ message:'Invalid media ID.' });
    if (!process.env.DATABASE_URL) {
      const items = mediaStore(req.app); const index = items.findIndex(x => Number(x.id) === id); if (index < 0) return res.status(404).json({ message:'Media item not found.' });
      const media = items[index]; const used = store(req.app).some(x => x.image_url === media.image_url); if (used) return res.status(409).json({ message:'This image is currently used by website content and cannot be deleted.' });
      removeFile(media.image_url); items.splice(index,1); return res.json({ success:true, deletedId:id });
    }
    const usage = await query('SELECT COUNT(*)::int AS count FROM adal_content_items WHERE image_url=$1',[await (async()=>{const r=await query('SELECT image_url FROM adal_media WHERE id=$1',[id]); if(!r.rows.length) return null; return r.rows[0].image_url;})()]);
    if (!usage.rows.length || usage.rows[0].count > 0) return usage.rows.length && usage.rows[0].count > 0 ? res.status(409).json({ message:'This image is currently used by website content and cannot be deleted.' }) : res.status(404).json({ message:'Media item not found.' });
    const result = await query('DELETE FROM adal_media WHERE id=$1 RETURNING image_url',[id]); if (!result.rows.length) return res.status(404).json({ message:'Media item not found.' }); removeFile(result.rows[0].image_url); return res.json({ success:true, deletedId:id });
  } catch (error) { return res.status(500).json({ message:error.message }); }
}

export async function uploadContentImage(req, res) {
  try { if (!req.file) return res.status(400).json({ message:'No image file provided.' }); return res.status(201).json({ success:true, image_url:mediaUrl(req.file.filename), image_name:req.file.originalname, mime_type:req.file.mimetype, size_bytes:req.file.size }); }
  catch (error) { return res.status(500).json({ message:error.message }); }
}

import fs from 'fs';
import path from 'path';
import { query } from '../db/postgres.js';
import { uploadDir } from '../config/upload.js';

const store = (app) => { if (!app.locals.mediaStore) app.locals.mediaStore = []; return app.locals.mediaStore; };
const removeFile = (url) => { if (!url || !String(url).startsWith('/uploads/')) return; const file = path.join(uploadDir, path.basename(url)); if (fs.existsSync(file)) fs.unlinkSync(file); };

export async function getMedia(req, res) {
  try {
    if (!process.env.DATABASE_URL) return res.json(store(req.app).sort((a,b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)));
    const result = await query('SELECT id,image_url,image_name,mime_type,size_bytes,uploaded_at FROM adal_media ORDER BY uploaded_at DESC');
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function uploadMedia(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided.' });
    const item = { image_url:`/uploads/${req.file.filename}`, image_name:req.file.originalname, mime_type:req.file.mimetype, size_bytes:req.file.size };
    if (!process.env.DATABASE_URL) {
      const media = { id: Math.max(0, ...store(req.app).map(x => Number(x.id))) + 1, ...item, uploaded_at:new Date().toISOString() };
      store(req.app).unshift(media); return res.status(201).json(media);
    }
    const result = await query('INSERT INTO adal_media (image_url,image_name,mime_type,size_bytes) VALUES ($1,$2,$3,$4) RETURNING *',[item.image_url,item.image_name,item.mime_type,item.size_bytes]);
    return res.status(201).json(result.rows[0]);
  } catch (error) { if (req.file) removeFile(`/uploads/${req.file.filename}`); return res.status(500).json({ message:error.message }); }
}

export async function deleteMedia(req, res) {
  try {
    const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ message:'Invalid media ID.' });
    if (!process.env.DATABASE_URL) {
      const items=store(req.app); const index=items.findIndex(x=>Number(x.id)===id); if(index<0)return res.status(404).json({message:'Media item not found.'});
      const media=items[index]; const used=(req.app.locals.contentStore||[]).some(x=>x.image_url===media.image_url); if(used)return res.status(409).json({message:'This image is currently used by website content and cannot be deleted.'});
      removeFile(media.image_url); items.splice(index,1); return res.json({success:true,deletedId:id});
    }
    const media=await query('SELECT image_url FROM adal_media WHERE id=$1',[id]); if(!media.rows.length)return res.status(404).json({message:'Media item not found.'});
    const used=await query('SELECT COUNT(*)::int AS count FROM adal_content_items WHERE image_url=$1',[media.rows[0].image_url]); if(used.rows[0].count>0)return res.status(409).json({message:'This image is currently used by website content and cannot be deleted.'});
    const result=await query('DELETE FROM adal_media WHERE id=$1 RETURNING image_url',[id]); removeFile(result.rows[0].image_url); return res.json({success:true,deletedId:id});
  } catch (error) { return res.status(500).json({ message:error.message }); }
}

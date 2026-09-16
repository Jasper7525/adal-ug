import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ImagePlus, RefreshCw, Search, Trash2, X } from 'lucide-react';

interface MediaItem { id:number; image_url:string; image_name:string; mime_type?:string; size_bytes?:number; uploaded_at:string; }

const readJson = async (response:Response) => {
  const text = await response.text();
  if (!text) throw new Error(`Server returned an empty response (HTTP ${response.status}).`);
  try { return JSON.parse(text); } catch { throw new Error(`Server returned an invalid response (HTTP ${response.status}).`); }
};

export const MediaLibraryPage:React.FC<{ onClose:()=>void }> = ({onClose}) => {
  const [token,setToken] = useState(()=>sessionStorage.getItem('adalAdminToken')||'');
  const [media,setMedia] = useState<MediaItem[]>([]);
  const [file,setFile] = useState<File|null>(null);
  const [search,setSearch] = useState('');
  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');
  const [selected,setSelected] = useState<MediaItem|null>(null);

  const headers = useMemo(()=>({'x-admin-token':token}),[token]);
  const load = async()=>{
    if(!token) return;
    setLoading(true); setError('');
    try {
      const response=await fetch('/api/admin/media',{headers});
      const data=await readJson(response);
      if(response.status===401){sessionStorage.removeItem('adalAdminToken');setToken('');throw new Error('Your admin session has expired. Sign in again from the Admin Portal.')}
      if(!response.ok) throw new Error(data.message||'Could not load media library.');
      setMedia(Array.isArray(data)?data:[]);
    } catch(e){setError(e instanceof Error?e.message:'Could not load media library.')} finally {setLoading(false)}
  };
  useEffect(()=>{load()},[token]);

  const upload=async()=>{
    if(!file)return;
    setLoading(true);setError('');setMessage('');
    try {
      const body=new FormData();body.append('image',file);
      const response=await fetch('/api/admin/media',{method:'POST',headers,body});
      const data=await readJson(response);
      if(!response.ok)throw new Error(data.message||'Upload failed.');
      setMessage('Image uploaded to the Media Library.');setFile(null);await load();
    } catch(e){setError(e instanceof Error?e.message:'Upload failed.')} finally {setLoading(false)}
  };

  const remove=async(item:MediaItem)=>{
    if(!confirm(`Delete ${item.image_name}?`))return;
    setError('');setMessage('');
    try{
      const response=await fetch(`/api/admin/media/${item.id}`,{method:'DELETE',headers});
      const data=await readJson(response);
      if(!response.ok)throw new Error(data.message||'Delete failed.');
      setMedia(items=>items.filter(x=>x.id!==item.id));setSelected(null);setMessage('Media deleted.');
    }catch(e){setError(e instanceof Error?e.message:'Delete failed.')}
  };

  const filtered=media.filter(item=>item.image_name.toLowerCase().includes(search.toLowerCase()));
  const formatSize=(bytes?:number)=>bytes?`${(bytes/1024/1024).toFixed(2)} MB`:'—';

  if(!token)return <section className="min-h-screen bg-slate-950 flex items-center justify-center px-4"><div className="max-w-md rounded-3xl bg-white p-8 text-center"><h1 className="text-2xl font-black">Media Library</h1><p className="mt-2 text-sm text-slate-500">Open the Admin Portal and sign in before opening the media library.</p><button onClick={onClose} className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white">Back to Admin</button></div></section>;

  return <section className="min-h-screen bg-slate-100 py-8"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header className="rounded-3xl bg-slate-950 p-6 text-white"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-orange-400">Admin Media</p><h1 className="mt-2 text-3xl font-black">Media Library</h1><p className="mt-2 text-sm text-slate-400">Upload once, then reuse images across website content.</p></div><div className="flex gap-2"><button onClick={load} className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-bold"><RefreshCw className="mr-2 inline h-4 w-4"/>Refresh</button><button onClick={onClose} className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-900"><ArrowLeft className="mr-2 inline h-4 w-4"/>Admin Dashboard</button></div></div></header>
    {(message||error)&&<div className={`mt-4 rounded-2xl p-4 text-sm font-semibold ${error?'bg-rose-50 text-rose-700':'bg-emerald-50 text-emerald-700'}`}>{error||message}</div>}
    <div className="mt-5 grid gap-5 lg:grid-cols-[320px,1fr]">
      <aside className="rounded-2xl bg-white p-6 shadow-sm h-fit"><h2 className="text-lg font-black">Add image</h2><p className="mt-1 text-xs text-slate-500">JPEG, PNG or WebP. Maximum 5 MB.</p><label className="mt-5 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-7 text-center hover:border-orange-400"><ImagePlus className="mx-auto h-8 w-8 text-slate-400"/><span className="mt-2 block text-xs font-bold text-slate-500">{file?file.name:'Choose an image'}</span><input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><button disabled={!file||loading} onClick={upload} className="mt-4 w-full rounded-xl bg-orange-500 py-3 text-xs font-black text-white disabled:opacity-50">{loading?'Uploading…':'Upload to Library'}</button></aside>
      <main className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-black">Your media</h2><p className="text-xs text-slate-500">{filtered.length} image{filtered.length===1?'':'s'}</p></div><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} className="field pl-9" placeholder="Search images"/></div></div>
      {loading&&!media.length?<p className="py-12 text-center text-sm text-slate-500">Loading media…</p>:filtered.length?<div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{filtered.map(item=><article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><button onClick={()=>setSelected(item)} className="block w-full text-left"><div className="aspect-square bg-slate-100"><img src={item.image_url} alt={item.image_name} className="h-full w-full object-cover"/></div><div className="p-3"><p className="truncate text-xs font-black">{item.image_name}</p><p className="mt-1 text-[11px] text-slate-500">{formatSize(item.size_bytes)}</p></div></button><div className="border-t border-slate-200 p-2"><button onClick={()=>remove(item)} className="w-full rounded-lg px-2 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="mr-1 inline h-3.5 w-3.5"/>Delete</button></div></article>)}</div>:<div className="py-16 text-center text-sm text-slate-500">No images in the library yet.</div>}</main></div>
    {selected&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" onClick={()=>setSelected(null)}><div className="w-full max-w-2xl rounded-3xl bg-white p-5" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between"><div><h3 className="font-black">{selected.image_name}</h3><p className="text-xs text-slate-500">{selected.mime_type||'image'} · {formatSize(selected.size_bytes)}</p></div><button onClick={()=>setSelected(null)}><X/></button></div><img src={selected.image_url} alt={selected.image_name} className="mt-4 max-h-[65vh] w-full rounded-2xl object-contain bg-slate-100"/></div></div>}
  </div></section>;
};

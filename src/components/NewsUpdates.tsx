import React, { useEffect, useState } from 'react';
import { Camera, Newspaper, Users, ArrowRight, ImageOff } from 'lucide-react';

type ContentItem = { id:number; type:string; title:string; body:string; image_url?:string|null; metadata?:Record<string, any>; published?:boolean; };
const fallback = {
  news: [{id:1,type:'news',title:'Safe LPG handling at home',body:'Practical guidance for cylinder storage, connections and everyday cooking safety.'}],
  gallery: [], staff: []
};

export const NewsUpdates: React.FC = () => {
  const [items, setItems] = useState<Record<string, ContentItem[]>>(fallback);
  useEffect(() => { fetch('/api/content').then(r => r.ok ? r.json() : []).then(data => { if (Array.isArray(data)) setItems({ news:data.filter(x=>x.type==='news'), gallery:data.filter(x=>x.type==='gallery'), staff:data.filter(x=>x.type==='staff') }); }).catch(() => {}); }, []);
  const articles = items.news;
  return <section id="news" className="py-20 bg-slate-950 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-10"><span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-400"><Newspaper className="h-4 w-4"/> News & Updates</span><h2 className="mt-3 text-3xl sm:text-4xl font-black font-display">What is happening at Adal</h2><p className="mt-3 text-slate-300">Company news, useful LPG articles, team information and selected moments from our work.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div id="articles" className="rounded-2xl border border-white/10 bg-white/5 p-6 scroll-mt-28"><Newspaper className="h-7 w-7 text-orange-400"/><h3 className="mt-4 text-xl font-black">News & Articles</h3><div className="mt-5 space-y-4">{articles.map(a=><article key={a.id} className="border-t border-white/10 pt-4"><h4 className="font-bold">{a.title}</h4><p className="mt-1 text-sm text-slate-400">{a.body}</p></article>)}{articles.length===0&&<p className="text-sm text-slate-400">New articles will appear here.</p>}</div></div>
        <div id="gallery" className="rounded-2xl border border-white/10 bg-white/5 p-6 scroll-mt-28"><Camera className="h-7 w-7 text-orange-400"/><h3 className="mt-4 text-xl font-black">Gallery</h3><div className="mt-5 grid grid-cols-2 gap-3">{items.gallery.map(g=><div key={g.id} className="overflow-hidden rounded-xl border border-white/10 bg-slate-800">{g.image_url?<img src={g.image_url} alt={g.title} className="aspect-square w-full object-cover"/>:<div className="aspect-square flex items-center justify-center text-slate-500"><ImageOff/></div>}<p className="p-3 text-xs font-bold">{g.title}</p></div>)}{items.gallery.length===0&&<p className="col-span-2 text-sm text-slate-400">Gallery images will appear here.</p>}</div></div>
        <div id="staff" className="rounded-2xl border border-white/10 bg-white/5 p-6 scroll-mt-28"><Users className="h-7 w-7 text-orange-400"/><h3 className="mt-4 text-xl font-black">Staff Members</h3><p className="mt-3 text-sm text-slate-400">Meet the people behind Adal's supply, customer service and LPG support operations.</p><div className="mt-5 space-y-3">{items.staff.map(s=><div key={s.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">{s.image_url?<img src={s.image_url} alt={s.title} className="h-12 w-12 rounded-full object-cover"/>:<div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center"><Users className="h-5 w-5 text-orange-400"/></div>}<div><p className="font-bold">{s.title}</p><p className="text-xs text-slate-400">{s.body}</p></div><ArrowRight className="ml-auto h-4 w-4 text-orange-400"/></div>)}{items.staff.length===0&&<p className="text-sm text-slate-400">Staff profiles will appear here.</p>}</div></div>
      </div>
    </div>
  </section>;
};

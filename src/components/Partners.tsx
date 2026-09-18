import React, { useEffect, useState } from 'react';
import { Handshake, ImageOff } from 'lucide-react';

type Partner = { id:number; title:string; body:string; image_url?:string|null; published?:boolean; };

const fallback:Partner[] = [
  { id:1, title:'NATGAS Uganda', body:'LPG logistics, distribution and technical services in Uganda.', image_url:'https://natgasuganda.com/wp-content/uploads/2022/06/NATGAS-LOGO.jpg' },
  { id:2, title:'TotalEnergies Uganda', body:'Energy partner and LPG brand operating in Uganda.', image_url:'https://cdn.greatugandajobs.com/jsjobsdata/data/employer/comp_7464/logo/totalenergies-logo-png_seeklogo-405344.png' },
];

export const Partners:React.FC=()=>{
  const [partners,setPartners]=useState<Partner[]>(fallback);
  useEffect(()=>{
    fetch('/api/content?type=partner')
      .then(r=>r.ok?r.json():[])
      .then(data=>{if(Array.isArray(data))setPartners(data);})
      .catch(()=>{});
  },[]);
  if(!partners.length)return null;
  return <section id="partners" className="scroll-mt-28 border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-orange-500"><Handshake className="h-4 w-4"/> Partners</span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Trusted energy partners</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Brands and organisations displayed here are managed from the protected Adal admin portal.</p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map(partner=><article key={partner.id} className="group flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
          {partner.image_url ? <img src={partner.image_url} alt={partner.title} className="max-h-20 max-w-[190px] object-contain transition-transform duration-300 group-hover:scale-105" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextElementSibling?.classList.remove('hidden')}}/> : null}
          <div className={partner.image_url?'hidden':''}><div className="flex items-center justify-center text-slate-300"><ImageOff className="h-8 w-8"/></div><p className="mt-2 text-center text-sm font-black text-slate-800">{partner.title}</p></div>
        </article>)}
      </div>
    </div>
  </section>;
};

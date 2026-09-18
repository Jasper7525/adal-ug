import React from 'react';
import { CheckCircle2, Clock3, ShieldCheck, Truck, Users } from 'lucide-react';

export const AboutUs: React.FC = () => (
  <section id="about" className="scroll-mt-28 bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,.95fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-orange-500">About Adal Uganda</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Safe, reliable LPG for homes and businesses.</h2>
          <p className="mt-6 text-base leading-8 text-slate-600">Adal Uganda Company Limited is an LPG cooking-gas distribution and delivery company serving Mbarara City and the wider Western Uganda market. We make it easier to get dependable LPG cylinders, accessories and doorstep supply while keeping safety and transparent service at the centre of every order.</p>
          <p className="mt-4 text-base leading-8 text-slate-600">From everyday household cooking to commercial requirements, our team is focused on verified products, safety-conscious service, responsive customer support and convenient delivery.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ['Safety first', 'Responsible LPG handling and safety-focused service.', ShieldCheck],
              ['Reliable delivery', 'Convenient supply and doorstep delivery support.', Truck],
              ['Local service', 'A Mbarara-based team serving Western Uganda.', Users],
              ['Responsive support', 'Clear communication before and after every order.', Clock3],
            ].map(([title, text, Icon]) => <div key={String(title)} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><Icon className="h-5 w-5 text-orange-500" /><h3 className="mt-3 font-black text-slate-900">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{String(text)}</p></div>)}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-orange-300"><CheckCircle2 className="h-4 w-4" /> Adal Uganda Company Limited</div>
            <h3 className="mt-8 text-3xl font-black">Our commitment</h3>
            <p className="mt-4 leading-7 text-slate-300">We aim to be a trusted LPG supply partner by combining product quality, safety-conscious operations and dependable customer service.</p>
            <div className="mt-8 space-y-4">{['Quality LPG cylinders and accessories','Safety-conscious handling and guidance','Convenient ordering and delivery','Customer-focused service'].map(item => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-orange-400" /><span className="text-sm font-semibold text-slate-200">{item}</span></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

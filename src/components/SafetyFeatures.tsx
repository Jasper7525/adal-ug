import React from 'react';
import { Award, BadgeCheck, CheckCheck, Flame, Scale, Wrench, ShieldAlert } from 'lucide-react';

export const SafetyFeatures: React.FC = () => {
  const trustPoints = [
    { icon: Scale, title: 'Verified Cylinder Weight', description: 'Check the cylinder weight at delivery with our digital weighing process so you can confirm what you receive.', badge: 'Weight Check' },
    { icon: BadgeCheck, title: 'Certified LPG Supply', description: 'We focus on compliant LPG cylinders and professional handling for homes, gas points and commercial kitchens.', badge: 'Quality & Safety' },
    { icon: Flame, title: 'Clean LPG Heat', description: 'LPG provides a clean-burning cooking flame suitable for domestic, hospitality and commercial kitchen applications.', badge: 'Clean Heat' },
    { icon: Wrench, title: 'Leak & Connection Support', description: 'Our team can assist with safe connections, leak checks and practical LPG equipment guidance.', badge: 'Service Support' },
  ];

  return <>
    <section id="features" className="py-16 bg-slate-50 border-y border-slate-200/80 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center max-w-3xl mx-auto mb-12"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3"><Award className="w-3.5 h-3.5 text-cyan-600" /> Why Adal</div><h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">Reliable Supply. Practical Safety. Professional Service.</h2><p className="mt-3 text-base text-slate-600">Clear product information, dependable LPG supply and practical support for gas points, homes and commercial kitchens.</p></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{trustPoints.map((point) => { const Icon = point.icon; return <div key={point.title} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"><div><div className="flex items-center justify-between mb-4"><div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md"><Icon className="w-6 h-6 text-orange-300" /></div><span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">{point.badge}</span></div><h3 className="text-lg font-bold text-slate-900 mb-2 font-display">{point.title}</h3><p className="text-sm text-slate-600 leading-relaxed">{point.description}</p></div><div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-cyan-800"><CheckCheck className="w-4 h-4 text-emerald-600" /><span>Adal service commitment</span></div></div>; })}</div></div>
    </section>
    <section id="safety-guide" className="py-14 bg-orange-50 border-b border-orange-100 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><div className="rounded-3xl bg-white border border-orange-100 shadow-sm p-6 sm:p-8"><div className="flex flex-col sm:flex-row gap-5 sm:items-center"><div className="w-14 h-14 shrink-0 rounded-2xl bg-orange-100 flex items-center justify-center"><ShieldAlert className="w-7 h-7 text-orange-600" /></div><div><span className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Safety Guide</span><h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">Use LPG safely every day</h2><p className="mt-2 text-sm sm:text-base text-slate-600">Keep cylinders upright and ventilated, inspect hoses and regulators regularly, keep flames away from leaks, and contact a qualified technician if you suspect a fault.</p></div></div></div></div>
    </section>
  </>;
};

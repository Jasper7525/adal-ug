import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react';

interface HeroProps { onExploreCatalog: () => void; onContactDepot: () => void; }

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onContactDepot }) => {
  const heroLineOne = 'LPG Cylinders, Accessories & Reliable Gas Supply';
  const heroLineTwo = 'From Adal Depot';
  const [typedLineOne, setTypedLineOne] = useState('');
  const [typedLineTwo, setTypedLineTwo] = useState('');

  useEffect(() => {
    if (typedLineOne.length < heroLineOne.length) {
      const timer = setTimeout(() => setTypedLineOne(heroLineOne.slice(0, typedLineOne.length + 1)), 28);
      return () => clearTimeout(timer);
    }
  }, [typedLineOne]);
  useEffect(() => {
    if (typedLineOne.length === heroLineOne.length && typedLineTwo.length < heroLineTwo.length) {
      const timer = setTimeout(() => setTypedLineTwo(heroLineTwo.slice(0, typedLineTwo.length + 1)), 28);
      return () => clearTimeout(timer);
    }
  }, [typedLineOne, typedLineTwo]);

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center"><div className="w-full max-w-4xl flex flex-col items-center text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.15] text-white max-w-4xl"><span className="typewriter-line block"><span className="typed-text text-white">{typedLineOne}</span></span><span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">{typedLineTwo}</span></h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">Adal Uganda Company Limited supplies certified LPG cylinders and accessories to gas points and commercial kitchens through the Mbarara depot. We supply the cylinders and safety goods that keep your LPG business moving with confidence.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1 pb-2">
            <div className="flex items-center gap-2 text-sm text-slate-200"><CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /><span><strong>Gas Cylinders:</strong> 3kg, 6kg, 12.5kg and 38kg LPG</span></div>
            <div className="flex items-center gap-2 text-sm text-slate-200"><CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /><span><strong>Accessories:</strong> regulators, hoses and safety gear</span></div>
            <div className="flex items-center gap-2 text-sm text-slate-200"><CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /><span><strong>Depot Supply:</strong> Mbarara gas-point distribution</span></div>
            <div className="flex items-center gap-2 text-sm text-slate-200"><Flame className="w-4 h-4 text-orange-400 shrink-0" /><span><strong>LPG Service:</strong> dependable supply and safety support</span></div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
            <button onClick={onContactDepot} id="hero-contact-depot-btn" className="group relative overflow-hidden inline-flex min-w-[210px] items-center justify-center gap-3 rounded-full border border-orange-300/40 bg-orange-500 px-7 py-4 text-base font-black text-white shadow-xl shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"><span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" /><span className="relative">Contact Adal Depot</span><ArrowRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" /></button>
            <button onClick={onExploreCatalog} id="hero-view-catalog-btn" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-6 py-4 text-base font-semibold text-slate-200 transition-all duration-300 hover:bg-slate-700 hover:text-white"><span>View Cylinders & Accessories</span></button>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 w-full"><div><p className="font-display text-2xl sm:text-3xl font-bold text-white">30<span className="text-orange-400 text-lg sm:text-xl">min</span></p><p className="text-xs text-slate-400">Avg Mbarara Delivery</p></div><div><p className="font-display text-2xl sm:text-3xl font-bold text-cyan-400">100<span className="text-white text-lg sm:text-xl">%</span></p><p className="text-xs text-slate-400">Accurate Weight Verified</p></div><div><p className="font-display text-2xl sm:text-3xl font-bold text-white">Mbarara</p><p className="text-xs text-slate-400">Depot Distribution</p></div></div>
        </div></div>
      </div>
    </section>
  );
};

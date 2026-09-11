import React, { useEffect, useState } from 'react';
import {
  Flame,
  ArrowRight,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onContactDepot: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onContactDepot }) => {
  const heroLineOne = 'LPG Cylinders, Accessories & Reliable Gas Supply';
  const heroLineTwo = 'From Adal Depot';
  const [typedLineOne, setTypedLineOne] = useState('');
  const [typedLineTwo, setTypedLineTwo] = useState('');

  useEffect(() => {
    if (typedLineOne.length < heroLineOne.length) {
      const timer = setTimeout(() => {
        setTypedLineOne(heroLineOne.slice(0, typedLineOne.length + 1));
      }, 34);

      return () => clearTimeout(timer);
    }
  }, [typedLineOne]);

  useEffect(() => {
    if (typedLineOne.length === heroLineOne.length && typedLineTwo.length < heroLineTwo.length) {
      const timer = setTimeout(() => {
        setTypedLineTwo(heroLineTwo.slice(0, typedLineTwo.length + 1));
      }, 34);

      return () => clearTimeout(timer);
    }
  }, [typedLineOne, typedLineTwo]);

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-cyan-300 text-xs sm:text-sm font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
              <span>Certified TotalEnergies LPG Distributor in Mbarara</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.15] text-white max-w-4xl">
              <span className="typewriter-line block">
                <span className="typed-text text-white">{typedLineOne}</span>
                <span className="typed-cursor">|</span>
              </span>
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent typewriter-line-second">
                {typedLineTwo}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Adal Uganda Company Limited supplies certified LPG cylinders and accessories to gas points and commercial kitchens through the Mbarara depot. We supply the cylinders and safety goods that keep your LPG business moving with confidence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1 pb-2">
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>Gas Cylinders:</strong> 3kg, 6kg, 12.5kg and 38kg LPG</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>Accessories:</strong> regulators, hoses and safety gear</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>Depot Supply:</strong> Mbarara gas-point distribution</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>Certified:</strong> TotalEnergies distributor network</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={onContactDepot}
                id="hero-contact-depot-btn"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl text-base font-bold text-slate-950 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 hover:from-orange-300 hover:to-amber-400 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
              >
                <Flame className="w-5 h-5 fill-slate-950 text-slate-950" />
                <span>Contact Adal Depot</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreCatalog}
                id="hero-view-catalog-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:text-white transition-all duration-300"
              >
                <span>View Cylinders & Accessories</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 w-full">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">30<span className="text-orange-400 text-lg sm:text-xl">min</span></p>
                <p className="text-xs text-slate-400">Avg Mbarara Delivery</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-cyan-400">100<span className="text-white text-lg sm:text-xl">%</span></p>
                <p className="text-xs text-slate-400">Accurate Weight Verified</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">Mbarara</p>
                <p className="text-xs text-slate-400">Depot Distribution</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

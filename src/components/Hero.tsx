import React from 'react';
import { 
  Flame,
  ArrowRight,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';
import { totalEnergiesCylindersImg } from '../data/products';

interface HeroProps {
  onQuickOrder: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickOrder, onExploreCatalog }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-cyan-300 text-xs sm:text-sm font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
              <span>Official UNBS Certified LPG Distributor in Mbarara City</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.15] text-white">
              Pure Flame, Safe Cooking Gas{' '}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Delivered in a short time
              </span>{' '}
              Across Mbarara.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Adal Uganda Company Limited supplies genuine, high-efficiency LPG cylinders and refills for homes,
              hostels, and restaurants. Enjoy guaranteed exact weight on digital scales, clean smokeless blue heat,
              and certified safety guidance for safe LPG use.
            </p>

            {/* Quick Benefits Bullet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1 pb-2">
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>100% Full Weight:</strong> Digital scale test on arrival</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>Delivery Support:</strong> Service across Mbarara zones</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>Safety Support:</strong> Leak inspection guidance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>Flexible Pay:</strong> Cash, MTN MoMo, or Airtel Money</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={onQuickOrder}
                id="hero-quick-order-btn"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl text-base font-bold text-slate-950 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 hover:from-orange-300 hover:to-amber-400 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
              >
                <Flame className="w-5 h-5 fill-slate-950 text-slate-950" />
                <span>Instant Quick Order</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreCatalog}
                id="hero-view-catalog-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:text-white transition-all duration-300"
              >
                <span>View Cylinders & Prices</span>
              </button>
            </div>

            {/* Key Metric Highlights */}
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
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">UNBS</p>
                <p className="text-xs text-slate-400">US EAS 900 Safety Seal</p>
              </div>
            </div>

          </div>

          {/* Right Column: Styled Showcase Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Glowing Backdrop Frame */}
            <div className="relative w-full max-w-md lg:max-w-none">
              
              <div className="relative rounded-3xl p-2 bg-gradient-to-tr from-cyan-500/20 via-slate-800/50 to-orange-500/20 backdrop-blur-md border border-slate-700/60 shadow-2xl">
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-square flex items-center justify-center">
                  <img
                    src={totalEnergiesCylindersImg}
                    alt="Adal Uganda LPG Cooking Gas Cylinders Lineup in Mbarara"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* On-image badge bottom */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Domestic & Commercial Sizes</p>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-400" />
                        3kg • 6kg • 12.5kg • 38kg
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      From UGX 28,000
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

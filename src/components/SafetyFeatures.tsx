import React from 'react';
import { Scale, ShieldCheck, Zap, Sparkles, Award, CheckCheck, Wrench, ShieldAlert } from 'lucide-react';

export const SafetyFeatures: React.FC = () => {
  const trustPoints = [
    {
      icon: Scale,
      title: 'Digital Scale Weight Guarantee',
      description: 'Never pay for under-filled gas. Every Adal delivery rider carries an authenticated digital scale so you can verify the gross cylinder weight at your doorstep.',
      badge: '100% Authentic'
    },
    {
      icon: ShieldCheck,
      title: 'UNBS & ISO Certified Cylinders',
      description: 'Strictly inspected to US EAS 900 standards. Pressure tested up to 30 bar, fitted with tamper-evident heat seals and premium auto-relief brass valves.',
      badge: 'Certified Safety'
    },
    {
      icon: Zap,
      title: 'Smokeless High-Calorie Blue Flame',
      description: 'Refilled with high-purity LPG mix that produces maximum thermal output with zero black smoke. Keeps your cooking sufurias clean and food tasting fresh.',
      badge: 'Pure Clean Heat'
    },
    {
      icon: Wrench,
      title: 'Complimentary Leak & Hookup Service',
      description: 'Our certified delivery agents don’t just drop off the cylinder. We connect it, perform a soapy water bubble check, and confirm zero leaks at no extra cost.',
      badge: 'Free Service'
    }
  ];

  return (
    <section id="features" className="py-16 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-cyan-600" />
            Corporate Standards & Safety
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Why Mbarara Trusts Adal Uganda for Cooking Gas
          </h2>
          <p className="mt-3 text-base text-slate-600">
            We operate with uncompromising safety protocols, honest weights, and local rapid dispatch. 
            Here is our safety promise to every home, restaurant, and institution across Mbarara.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-900 to-cyan-700 text-white flex items-center justify-center shadow-md shadow-cyan-900/10">
                      <Icon className="w-6 h-6 text-cyan-200" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {point.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                    {point.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-cyan-800">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Adal Quality</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

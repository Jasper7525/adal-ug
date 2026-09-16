import React from 'react';
import { Camera, Newspaper, Users, ArrowRight } from 'lucide-react';

export const NewsUpdates: React.FC = () => {
  const articles = [
    { title: 'Safe LPG handling at home', text: 'Practical guidance for cylinder storage, connections and everyday cooking safety.' },
    { title: 'Adal supply and service updates', text: 'Follow company updates, product availability and service information.' },
    { title: 'Supporting safer gas points', text: 'Learn how professional LPG support can help homes and commercial kitchens.' },
  ];

  return (
    <section id="news" className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-400"><Newspaper className="h-4 w-4" /> News & Updates</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black font-display">What is happening at Adal</h2>
          <p className="mt-3 text-slate-300">Company news, useful LPG articles, team information and selected moments from our work.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div id="articles" className="rounded-2xl border border-white/10 bg-white/5 p-6 scroll-mt-28">
            <Newspaper className="h-7 w-7 text-orange-400" />
            <h3 className="mt-4 text-xl font-black">News & Articles</h3>
            <div className="mt-5 space-y-4">
              {articles.map(article => <article key={article.title} className="border-t border-white/10 pt-4"><h4 className="font-bold">{article.title}</h4><p className="mt-1 text-sm text-slate-400">{article.text}</p></article>)}
            </div>
          </div>

          <div id="gallery" className="rounded-2xl border border-white/10 bg-white/5 p-6 scroll-mt-28">
            <Camera className="h-7 w-7 text-orange-400" />
            <h3 className="mt-4 text-xl font-black">Gallery</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {['Adal LPG supply', 'Cylinder handling', 'Gas point support', 'Team at work'].map((label, index) => <div key={label} className="aspect-square rounded-xl bg-gradient-to-br from-orange-500/30 to-slate-800 border border-white/10 flex items-end p-3"><span className="text-xs font-bold">{label}</span></div>)}
            </div>
          </div>

          <div id="staff" className="rounded-2xl border border-white/10 bg-white/5 p-6 scroll-mt-28">
            <Users className="h-7 w-7 text-orange-400" />
            <h3 className="mt-4 text-xl font-black">Staff Members</h3>
            <p className="mt-3 text-sm text-slate-400">Meet the people behind Adal's supply, customer service and LPG support operations.</p>
            <div className="mt-5 space-y-3">
              {['Operations Team', 'Customer Support', 'LPG Technical Team'].map(role => <div key={role} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3"><span className="font-semibold">{role}</span><ArrowRight className="h-4 w-4 text-orange-400" /></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import {
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Twitter,
  Music2,
  Youtube,
  Facebook,
  Download,
} from 'lucide-react';
import { MBARARA_DELIVERY_ZONES } from '../data/products';
import { AdalLogo } from './AdalLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenCodeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCodeModal }) => {
  const socialLinks = [
    { label: 'WhatsApp', href: 'https://wa.me/256772123456', icon: MessageCircle, className: 'text-emerald-400 hover:text-emerald-300' },
    { label: 'X', href: 'https://x.com/adaluganda', icon: Twitter, className: 'text-slate-300 hover:text-white' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@adaluganda', icon: Music2, className: 'text-pink-400 hover:text-pink-300' },
    { label: 'YouTube', href: 'https://www.youtube.com/@adaluganda', icon: Youtube, className: 'text-red-400 hover:text-red-300' },
    { label: 'Facebook', href: 'https://www.facebook.com/adaluganda', icon: Facebook, className: 'text-blue-400 hover:text-blue-300' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <AdalLogo variant="horizontal" theme="dark" size="md" />

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Adal Uganda Company Limited is Western Uganda’s leading LPG cooking gas cylinder distribution 
              service based in Mbarara City. Providing verified weight cylinders, safe UNBS-certified brass 
              valves, and rapid 30-minute doorstep deliveries.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                UNBS US EAS 900 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                URSB Registered Company
              </span>
            </div>
          </div>

          {/* Column 2: Products & Sizes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">LPG Cylinders</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-orange-400 transition-colors">
                  3kg Camping Cylinder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-orange-400 transition-colors">
                  6kg Domestic Cylinder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-orange-400 transition-colors">
                  12.5kg Family Standard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-orange-400 transition-colors">
                  38kg Commercial Cylinder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('accessories')} className="hover:text-orange-400 transition-colors">
                  Safety Regulators & Hoses
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Mbarara Delivery Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Delivery Hubs</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              {MBARARA_DELIVERY_ZONES.slice(0, 6).map(zone => (
                <li key={zone.id} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{zone.name.split('&')[0]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Contact & Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Contacts</h4>
            <div className="space-y-2">
              <a href="tel:+256772123456" className="flex items-start gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>+256 772 123 456 (Dispatch)</span>
              </a>
              <a href="tel:+256701987654" className="flex items-start gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>+256 701 987 654 (Admin)</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Plot 14, Mbarara-Masaka Highway, Mbarara City, Uganda</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 transition hover:bg-slate-800 hover:border-slate-500"
                    >
                      <Icon className={`w-4 h-4 ${social.className}`} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Adal Uganda Company Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Mbarara City, Uganda</span>
            <span>•</span>
            <span className="text-slate-500">Powered by Clean LPG Energy</span>
            <span>•</span>
            <a
              href="/docs/adal-uganda-user-requirements-document.html"
              download="adal-uganda-user-requirements-document.html"
              className="inline-flex items-center gap-1.5 text-orange-300 hover:text-orange-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download URD
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

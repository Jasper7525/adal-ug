import React, { useState, useEffect } from 'react';
import { Phone, ShoppingBag, Menu, X, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';
import { OrderItem } from '../types';
import { AdalLogo } from './AdalLogo';

interface NavbarProps {
  orderItems: OrderItem[];
  onOpenOrderModal: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ orderItems, onOpenOrderModal, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Top emergency announcement bar */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium text-[11px] border border-orange-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
              Fast Mbarara Delivery
            </span>
            <span className="text-slate-300">
              Express 30–45 min gas refills across Kakoba, Kamukuzi, Booma, Nyamitanga & Ruharo
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Mbarara City, Uganda
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <a 
              href="tel:+256772123456" 
              className="flex items-center gap-1 font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Hotline: +256 772 123 456
            </a>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="group flex items-center cursor-pointer select-none py-1 hover:opacity-95 transition-opacity"
            id="nav-logo"
            aria-label="Adal Energies - Return to top"
          >
            <AdalLogo variant="horizontal" size="md" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Home', target: 'home' },
              { label: 'Cylinders & Prices', target: 'catalog' },
              { label: 'Accessories', target: 'accessories' },
              { label: 'Why Adal', target: 'features' },
              { label: 'Safety Guide', target: 'safety' },
              { label: 'Contact & Depot', target: 'contact' },
            ].map((link) => (
              <button
                key={link.target}
                onClick={() => handleLinkClick(link.target)}
                className="relative text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full rounded-full" />
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Quick Phone Call Button */}
            <a
              href="tel:+256772123456"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-cyan-800 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
              title="Call Mbarara Dispatch"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-600" />
              <span>Call Dispatch</span>
            </a>

            {/* Order Cart / Order Now Button */}
            <button
              onClick={onOpenOrderModal}
              id="nav-order-now-btn"
              className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
              {totalCartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black bg-slate-900 text-white rounded-full ml-1">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', target: 'home' },
                { label: 'Cylinders & Prices', target: 'catalog' },
                { label: 'Accessories', target: 'accessories' },
                { label: 'Why Adal', target: 'features' },
                { label: 'Safety Guide', target: 'safety' },
                { label: 'Contact & Depot', target: 'contact' },
              ].map((link) => (
                <button
                  key={link.target}
                  onClick={() => handleLinkClick(link.target)}
                  className="flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-cyan-700 transition-colors"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}

              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href="tel:+256772123456"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-cyan-900 bg-cyan-50 border border-cyan-200"
                >
                  <Phone className="w-4 h-4 text-cyan-600" />
                  Call Mbarara Depot: +256 772 123 456
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrderModal();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Open Instant Order Form ({totalCartCount} items)
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

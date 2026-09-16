import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SafetyFeatures } from './components/SafetyFeatures';
import { ProductCatalog } from './components/ProductCatalog';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { StandaloneCodeModal } from './components/StandaloneCodeModal';
import { AdminPage } from './components/AdminPage';
import { MediaLibraryPage } from './components/MediaLibraryPage';
import { NewsUpdates } from './components/NewsUpdates';

export default function App() {
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(() => window.location.hash === '#admin' || window.location.hash === '#admin-media');
  const [mediaOpen, setMediaOpen] = useState(() => window.location.hash === '#admin-media');

  useEffect(() => {
    const onHashChange = () => {
      setAdminOpen(window.location.hash === '#admin' || window.location.hash === '#admin-media');
      setMediaOpen(window.location.hash === '#admin-media');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (sectionId === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAdmin = () => { setAdminOpen(false); setMediaOpen(false); window.location.hash = ''; };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <Navbar onNavigate={scrollToSection} />
      <main className="flex-1">
        {mediaOpen ? <MediaLibraryPage onClose={() => { setMediaOpen(false); setAdminOpen(true); window.location.hash = '#admin'; }} /> : adminOpen ? <AdminPage onClose={closeAdmin} /> : <>
          <Hero onExploreCatalog={() => scrollToSection('catalog')} onContactDepot={() => scrollToSection('contact')} />
          <SafetyFeatures />
          <ProductCatalog onContactDepot={() => scrollToSection('contact')} />
          <NewsUpdates />
          <ContactSection />
        </>}
      </main>
      <Footer onNavigate={scrollToSection} onOpenCodeModal={() => setCodeModalOpen(true)} />
      <FloatingWhatsApp />
      <StandaloneCodeModal isOpen={codeModalOpen} onClose={() => setCodeModalOpen(false)} />
    </div>
  );
}

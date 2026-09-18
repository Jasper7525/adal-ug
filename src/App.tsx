import React, { useState, useEffect, useRef } from 'react';
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
import { PasswordManagementPage } from './components/PasswordManagementPage';
import { NewsUpdates } from './components/NewsUpdates';
import { AboutUs } from './components/AboutUs';

const ADMIN_HASHES = ['#admin', '#admin-media', '#admin-reset', '#admin-change'];

export default function App() {
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(() => ADMIN_HASHES.includes(window.location.hash));
  const [mediaOpen, setMediaOpen] = useState(() => window.location.hash === '#admin-media');
  const [passwordPage, setPasswordPage] = useState<'reset'|'change'|null>(() => window.location.hash === '#admin-reset' ? 'reset' : window.location.hash === '#admin-change' ? 'change' : null);
  const [authVersion, setAuthVersion] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const wasAdminRoute = useRef(ADMIN_HASHES.includes(window.location.hash));

  useEffect(() => {
    // A fresh page visit to an admin URL must always start at login.
    if (adminOpen) {
      sessionStorage.removeItem('adalAdminToken');
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const isAdminRoute = ADMIN_HASHES.includes(window.location.hash);
      const enteringAdmin = isAdminRoute && !wasAdminRoute.current;
      setAdminOpen(isAdminRoute);
      setMediaOpen(window.location.hash === '#admin-media');
      setPasswordPage(window.location.hash === '#admin-reset' ? 'reset' : window.location.hash === '#admin-change' ? 'change' : null);
      if (enteringAdmin) {
        sessionStorage.removeItem('adalAdminToken');
        setAuthenticated(false);
        setAuthVersion(value => value + 1);
      }
      wasAdminRoute.current = isAdminRoute;
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setAuthenticated(Boolean(sessionStorage.getItem('adalAdminToken'))), 400);
    return () => window.clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (sectionId === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAdmin = () => { sessionStorage.removeItem('adalAdminToken'); setAuthenticated(false); setAdminOpen(false); setMediaOpen(false); setPasswordPage(null); wasAdminRoute.current = false; window.location.hash = ''; };
  const openMedia = () => { setMediaOpen(true); window.location.hash = '#admin-media'; };
  const openReset = () => { setPasswordPage('reset'); setAdminOpen(true); setMediaOpen(false); window.location.hash = '#admin-reset'; };
  const openChange = () => { setPasswordPage('change'); setAdminOpen(true); setMediaOpen(false); window.location.hash = '#admin-change'; };
  const backToAdmin = () => { setPasswordPage(null); setAdminOpen(true); setMediaOpen(false); window.location.hash = '#admin'; };

  const adminView = passwordPage ? <PasswordManagementPage mode={passwordPage} onBack={backToAdmin} /> : mediaOpen && authenticated ? <MediaLibraryPage onClose={() => { setMediaOpen(false); setAdminOpen(true); window.location.hash = '#admin'; }} /> : adminOpen ? <AdminPage key={authVersion} onClose={closeAdmin} /> : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <Navbar onNavigate={scrollToSection} />
      <main className="flex-1 relative">
        {adminOpen ? adminView : <>
          <Hero onExploreCatalog={() => scrollToSection('catalog')} onContactDepot={() => scrollToSection('contact-form')} />
          <SafetyFeatures />
          <ProductCatalog onContactDepot={() => scrollToSection('contact-form')} />
          <AboutUs />
          <NewsUpdates />
          <ContactSection />
        </>}
        {adminOpen && !mediaOpen && !passwordPage && !authenticated && <button onClick={openReset} className="fixed bottom-6 right-6 z-40 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-800 shadow-xl hover:bg-slate-50">Forgot / reset password?</button>}
        {adminOpen && !mediaOpen && !passwordPage && authenticated && <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"><button onClick={openChange} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-800 shadow-xl hover:bg-slate-50">Change password</button><button onClick={openMedia} className="rounded-full bg-orange-500 px-5 py-3 text-xs font-black text-white shadow-xl hover:bg-orange-600">Media Library</button></div>}
      </main>
      <Footer onNavigate={scrollToSection} onOpenCodeModal={() => setCodeModalOpen(true)} />
      <FloatingWhatsApp />
      <StandaloneCodeModal isOpen={codeModalOpen} onClose={() => setCodeModalOpen(false)} />
    </div>
  );
}

import { AlertTriangle, Download, Gavel, X, ChevronDown, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'motion/react';

export default function LegalPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialApp = searchParams.get('app') || 'rhumbnav';
  
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(initialApp);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(true);

  // If query parameter changes, update state
  useEffect(() => {
    const appParam = searchParams.get('app');
    if (appParam) {
      setSelectedApp(appParam);
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id], header[id]');
      let current = 'intro';
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        // If the top of the section is above the middle of the screen (with some offset for the header)
        if (sectionTop <= 200) {
          current = section.getAttribute('id') || 'intro';
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary/30 min-h-screen">
      <TopBar />

      {/* Mobile Legal Subheader */}
      <div className="md:hidden fixed top-[72px] left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-b border-[#424854]/15 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Gavel className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Privacy & Legal</span>
          </div>
          <span className="text-sm font-bold text-on-surface">{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} Documents</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-xs bg-primary/10 text-primary px-4 py-2 rounded-full font-bold uppercase tracking-wider hover:bg-primary/20 transition-colors flex items-center gap-2"
        >
          <Menu className="w-3 h-3" />
          Index
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-surface border-r border-[#424854]/15 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col py-6 px-6 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center h-12 md:h-16">
              <img src="/RL1.png" alt="Rhumb Labs" className="h-full w-auto object-left object-contain scale-[2] md:scale-[2.5] origin-left -translate-x-4 md:-translate-x-8" />
            </Link>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#c8d8f3] hover:text-[#81ecff]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-surface-container-highest rounded-lg">
              <Gavel className="text-primary w-5 h-5" />
            </div>
            <div>
              <div className="text-[#e0e5f4] font-bold text-xs uppercase tracking-widest font-manrope">Privacy & Legal</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {/* RhumbNav Selector */}
            <div className="relative">
              <button 
                onClick={() => setSelectedApp('rhumbnav')}
                className={`w-full text-on-surface text-sm font-medium rounded-xl px-4 py-3.5 flex justify-between items-center transition-all cursor-pointer ${selectedApp === 'rhumbnav' ? 'bg-surface-container-low' : 'bg-transparent hover:bg-surface-container-low/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xs font-bold">R</span>
                  </div>
                  <span>RhumbNav</span>
                </div>
                <motion.div animate={{ rotate: selectedApp === 'rhumbnav' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {selectedApp === 'rhumbnav' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2">Sections</div>
                    <nav className="flex flex-col gap-1 font-manrope text-sm pb-2">
                      <a href="#intro" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'intro' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Introduction</a>
                      <a href="#privacy" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'privacy' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Privacy policy</a>
                      <a href="#terms" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'terms' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Terms of use</a>
                      <a href="#billing" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'billing' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Billing & refund policy</a>
                      <a href="#aviation" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'aviation' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Aviation disclaimer</a>
                      <a href="#open-source" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'open-source' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Open source notices</a>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pogo Selector */}
            <div className="relative">
              <button 
                onClick={() => setSelectedApp('pogo')}
                className={`w-full text-on-surface text-sm font-medium rounded-xl px-4 py-3.5 flex justify-between items-center transition-all cursor-pointer ${selectedApp === 'pogo' ? 'bg-surface-container-low' : 'bg-transparent hover:bg-surface-container-low/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#c084fc]/10 flex items-center justify-center">
                    <span className="text-[#c084fc] text-xs font-bold">P</span>
                  </div>
                  <span>Pogo</span>
                </div>
                <motion.div animate={{ rotate: selectedApp === 'pogo' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {selectedApp === 'pogo' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2">Sections</div>
                    <nav className="flex flex-col gap-1 font-manrope text-sm pb-2">
                      <a href="#intro" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'intro' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Introduction</a>
                      <a href="#privacy" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'privacy' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Privacy policy</a>
                      <a href="#terms" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'terms' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Terms of use</a>
                      <a href="#billing" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'billing' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Billing & refund policy</a>
                      <a href="#climbing" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'climbing' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Climbing disclaimer</a>
                      <a href="#open-source" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'open-source' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Open source notices</a>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-8 border-t border-[#424854]/15">
          <button className="bg-[#1e2635] text-[#81ecff] py-3 px-4 rounded-lg flex items-center justify-between group transition-all hover:bg-primary/10">
            <span className="text-[10px] font-bold uppercase tracking-widest">Download Full Pack</span>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="pt-[140px] md:pt-32 min-h-screen max-w-[1440px] mx-auto flex flex-col md:flex-row relative">
        {/* SideNavBar */}
        <aside className="hidden md:flex h-screen sticky top-20 w-80 flex-col gap-6 py-12 px-8 border-r border-[#424854]/15 bg-surface">
          <div className="flex flex-col gap-2">
            {/* RhumbNav Selector */}
            <div className="relative">
              <button 
                onClick={() => setSelectedApp('rhumbnav')}
                className={`w-full text-on-surface text-sm font-medium rounded-xl px-4 py-3.5 flex justify-between items-center transition-all cursor-pointer ${selectedApp === 'rhumbnav' ? 'bg-surface-container-low' : 'bg-transparent hover:bg-surface-container-low/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xs font-bold">R</span>
                  </div>
                  <span>RhumbNav</span>
                </div>
                <motion.div animate={{ rotate: selectedApp === 'rhumbnav' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {selectedApp === 'rhumbnav' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2">Sections</div>
                    <nav className="flex flex-col gap-1 font-manrope text-sm pb-2">
                      <a href="#intro" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'intro' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Introduction</a>
                      <a href="#privacy" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'privacy' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Privacy policy</a>
                      <a href="#terms" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'terms' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Terms of use</a>
                      <a href="#billing" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'billing' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Billing & refund policy</a>
                      <a href="#aviation" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'aviation' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Aviation disclaimer</a>
                      <a href="#open-source" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'open-source' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Open source notices</a>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pogo Selector */}
            <div className="relative">
              <button 
                onClick={() => setSelectedApp('pogo')}
                className={`w-full text-on-surface text-sm font-medium rounded-xl px-4 py-3.5 flex justify-between items-center transition-all cursor-pointer ${selectedApp === 'pogo' ? 'bg-surface-container-low' : 'bg-transparent hover:bg-surface-container-low/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#c084fc]/10 flex items-center justify-center">
                    <span className="text-[#c084fc] text-xs font-bold">P</span>
                  </div>
                  <span>Pogo</span>
                </div>
                <motion.div animate={{ rotate: selectedApp === 'pogo' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {selectedApp === 'pogo' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2">Sections</div>
                    <nav className="flex flex-col gap-1 font-manrope text-sm pb-2">
                      <a href="#intro" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'intro' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Introduction</a>
                      <a href="#privacy" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'privacy' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Privacy policy</a>
                      <a href="#terms" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'terms' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Terms of use</a>
                      <a href="#billing" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'billing' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Billing & refund policy</a>
                      <a href="#climbing" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'climbing' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Climbing disclaimer</a>
                      <a href="#open-source" className={`py-2 px-4 transition-all border-l-2 ${activeSection === 'open-source' ? 'text-[#c084fc] font-bold border-[#c084fc] bg-[#c084fc]/5' : 'text-[#c8d8f3]/60 hover:text-[#c084fc] hover:bg-surface-container-low border-transparent'}`}>Open source notices</a>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-4 pt-8 border-t border-[#424854]/15">
            <button className="bg-[#1e2635] text-[#81ecff] py-3 px-4 rounded-lg flex items-center justify-between group transition-all hover:bg-primary/10">
              <span className="text-[10px] font-bold uppercase tracking-widest">Download Full Pack</span>
              <Download className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Content Canvas */}
        <div className="flex-1 px-8 md:px-24 py-16 relative">
          <header id="intro" className="mb-16">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-6 leading-[0.9]">{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} <br /><span className="text-primary">Privacy & Legal.</span></h1>
            <p className="text-xl text-on-surface-variant max-w-2xl font-manrope">
              Review the documents below for privacy practices, terms of use, disclaimers, open source licenses, and third-party data and service notices.
            </p>
          </header>

          <div className="space-y-40 legal-text">
            {/* 1. {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} Privacy Policy */}
            <section id="privacy" className="scroll-mt-48">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="max-w-3xl space-y-6 text-on-surface-variant">
                <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-bold text-on-surface">Controller / Responsible Entity:</span> Rhumb Labs</div>
                    <div><span className="font-bold text-on-surface">Privacy Contact:</span> rhumblabs@gmail.com</div>
                    <div className="md:col-span-2"><span className="font-bold text-on-surface">Effective Date:</span> April 10, 2026</div>
                  </div>
                </div>
                <p>This Privacy Policy explains what data {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} collects or may collect, how that data is used, when it may be shared, how long it may be retained, and what choices and rights users may have when using the app, related support channels, and associated cloud services.</p>
                
                <h3 id="privacy-overview" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">1. Overview</h3>
                <p>{selectedApp === 'rhumbnav' ? 'RhumbNav is an aviation-related application that may provide planning, navigation support, calculation, reference, weather, mapping, synchronization, export, and related account features. This Privacy Policy applies to RhumbNav, related support channels, and any associated cloud services made available by Rhumb Labs.' : 'Pogo is a bouldering and climbing application that may provide session logging, progress tracking, statistics visualization, achievements, and related account features. This Privacy Policy applies to Pogo, related support channels, and any associated cloud services made available by Rhumb Labs.'}</p>
                
                <h3 id="privacy-data" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">2. Data We Collect</h3>
                <p>Depending on the features you use and the version of the app you install, {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} may collect or process account data, user-generated content, location data, device-permission data, purchase information, diagnostics, and limited technical metadata needed to operate, secure, and improve the service.</p>
                
                <h3 id="privacy-account" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">3. Account and Authentication Data</h3>
                <p>If you create an account or sign in using a supported provider, {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} may collect authentication and account information such as your user ID, display name, email address, authentication provider details, and similar account metadata. If enabled in the released build, sign-in may be provided through services such as email/password authentication, Google Sign-In, Firebase Authentication, or similar identity providers.</p>
                
                <h3 id="privacy-content" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">4. User Content and Saved Data</h3>
                <p>{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} may store or process the content you choose to create, save, upload, synchronize, export, or attach in the app, including aircraft profiles, flight plans, route data, waypoints, logbook entries, reminders, checklists, preferences, notes, exported documents, and attached photos or files where those features are available.</p>
                
                <h3 id="privacy-location" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">5. Location, Sensor, and Permission-Based Data</h3>
                <p>If you enable location-based or navigation-related features, {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} may access approximate or precise location and limited motion or sensor information needed to support moving-map features, route presentation, track display, or related cockpit-assistance functions. Depending on the features you use, the app may also request permissions such as notifications, camera access, and file or photo access. Disabling permissions may limit or disable some features.</p>
                
                <h3 id="privacy-purchase" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">6. Purchase and Subscription Data</h3>
                <p>If {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} offers paid plans, premium features, or in-app purchases, the app and the applicable platform billing provider may process subscription status, purchase tokens, entitlement status, transaction timestamps, country or store region, and related billing metadata required to validate purchases, manage access, prevent abuse, and handle customer support. Rhumb Labs does not receive your full payment card details from Google Play.</p>
                
                <h3 id="privacy-diagnostics" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">7. Diagnostics and Usage Data</h3>
                <p>{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} may collect technical and usage diagnostics such as screens visited, feature usage, crash reports, performance metrics, device model, operating system version, app instance identifiers, and similar troubleshooting or analytics data, but only to the extent enabled by the services integrated into the released build.</p>
                
                <h3 id="privacy-how-we-use" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">8. How We Use Data</h3>
                <p>Rhumb Labs uses data to provide authentication and account access, operate requested features, enable cloud synchronization across devices, restore backups, store preferences, validate subscriptions, generate exports, improve reliability and performance, detect fraud or abuse, protect the security of users and services, respond to support requests, and comply with legal obligations.</p>
                
                <h3 id="privacy-cloud" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">9. Cloud Sync and Local Storage</h3>
                <p>Certain data may remain stored locally on your device. If cloud synchronization is offered and you choose to use it, relevant data may also be transmitted to and stored by Rhumb Labs or its service providers for backup, restore, device-to-device sync, account continuity, and fraud-prevention purposes.</p>
                
                <h3 id="privacy-legal-bases" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">10. Legal Bases</h3>
                <p>Where required by applicable law, Rhumb Labs relies on one or more of the following legal bases: performance of a contract, consent, legitimate interests, and compliance with legal obligations. Where processing is based on consent, you may withdraw that consent, although this will not affect processing already carried out before withdrawal.</p>
                
                <h3 id="privacy-sharing" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">11. Sharing of Data</h3>
                <p>{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} may share personal data with service providers and infrastructure vendors that support operation of the app, such as authentication providers, cloud database or storage providers, crash reporting or analytics providers, billing and subscription platforms, mapping providers, airport and aviation data providers, and weather data providers. Data may also be disclosed where required by law, legal process, or where reasonably necessary to protect rights, safety, security, or the integrity of the service. Rhumb Labs does not sell personal data for money.</p>
                
                <h3 id="privacy-international" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">12. International Transfers</h3>
                <p>Your data may be processed or stored in countries other than your own. Where required, Rhumb Labs will take reasonable steps intended to implement appropriate safeguards for international data transfers through reputable providers, contractual measures, or other mechanisms recognized by applicable law.</p>
                
                <h3 id="privacy-retention" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">13. Data Retention</h3>
                <p>Data may be retained for as long as reasonably necessary for the purposes described in this Privacy Policy, including to provide services, maintain backups, resolve disputes, enforce agreements, comply with legal obligations, protect against fraud or abuse, and document subscription or account actions. Retention periods may vary depending on the data category, storage location, and service provider.</p>
                
                <h3 id="privacy-choices" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">14. Your Choices and Rights</h3>
                <p>Depending on your jurisdiction, you may have rights to access, correct, delete, restrict, object to, or export certain personal data, and to withdraw consent where processing is based on consent. You may also revoke device permissions through your device settings. Requests may be sent to rhumblabs@gmail.com.</p>
                
                <h3 id="privacy-deletion" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">15. Account Deletion</h3>
                <p>If {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} allows account creation, users may request deletion of their account and associated data from within the app and through the public web deletion request page identified by Rhumb Labs. The public deletion request page must be available before publication and should be inserted here: [INSERT ACCOUNT-DELETION URL]. Some information may be retained for a limited period where reasonably necessary for legal compliance, fraud prevention, abuse investigation, backup integrity, dispute resolution, or security purposes. Data remaining only on your local device may continue to exist until deleted from the device or app.</p>
                
                <h3 id="privacy-security" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">16. Security</h3>
                <p>Rhumb Labs uses reasonable technical and organizational measures intended to protect data, such as encrypted transmission where applicable, access controls, restricted administrative access, and service-provider safeguards. However, no method of transmission, storage, or processing is completely secure, and absolute security cannot be guaranteed.</p>
                
                <h3 id="privacy-children" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">17. Children</h3>
                <p>{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} is not directed to children under 13, or any higher minimum age required by local law. If you believe a child has provided personal data in violation of this Privacy Policy, contact rhumblabs@gmail.com.</p>
                
                <h3 id="privacy-changes" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">18. Changes to This Privacy Policy</h3>
                <p>This Privacy Policy may be updated from time to time. The current version will be made available in the app, on the website, or both. Continued use of {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} after changes become effective may constitute acceptance where permitted by law.</p>
                
                <h3 id="privacy-contact" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">24. Contact</h3>
                <p>For privacy questions, rights requests, or deletion requests, contact: rhumblabs@gmail.com.</p>
              </div>
            </section>

            {/* 2. {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} Terms of Use */}
            <section id="terms" className="scroll-mt-48">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Use</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="max-w-3xl space-y-6 text-on-surface-variant">
                <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-bold text-on-surface">Owner / Developer:</span> Rhumb Labs</div>
                    <div><span className="font-bold text-on-surface">Support Contact:</span> rhumblabs@gmail.com</div>
                    <div className="md:col-span-2"><span className="font-bold text-on-surface">Effective Date:</span> April 10, 2026</div>
                  </div>
                </div>
                <p>These Terms should be published together with the Privacy Policy, Subscription and Refund Policy, Aviation Disclaimer, and Open Source / Third-Party Notices.</p>

                <h3 id="terms-acceptance" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">1. Acceptance</h3>
                <p>By downloading, installing, accessing, or using {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}, you agree to be bound by these Terms of Use. If you do not agree, do not use the app.</p>

                <h3 id="terms-purpose" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">2. Purpose of the App</h3>
                <p>{selectedApp === 'rhumbnav' ? 'RhumbNav provides aviation-related calculation, planning, reference, training, and support tools, including route planning, headings, distances, times, conversions, airport-related information, moving-map or route-display features where available, and weather-related information received from third parties.' : 'Pogo provides bouldering and climbing-related logging, tracking, statistics, and motivational tools, including session logging, route tracking, and achievements.'}</p>

                {selectedApp === 'rhumbnav' ? (
                  <>
                    <h3 id="terms-not-primary" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">3. Not for Primary Navigation or Certified Operational Use</h3>
                    <p>RhumbNav is provided strictly for reference, advisory, planning, training, and support use only. It is not a certified navigation system and does not replace official charts, AIP or current aeronautical publications, NOTAMs, ATC instructions, onboard instruments, required preflight or inflight procedures, certified avionics, or any legally required source of navigational, meteorological, performance, or safety information.</p>
                  </>
                ) : (
                  <>
                    <h3 id="terms-not-primary" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">3. Not a Substitute for Professional Instruction</h3>
                    <p>Pogo is provided strictly for logging, tracking, and motivational use only. It is not a substitute for professional climbing instruction, certified trainers, safe climbing practices, or medical advice. Bouldering and climbing are inherently dangerous activities.</p>
                  </>
                )}

                {selectedApp === 'rhumbnav' ? (
                  <>
                    <h3 id="terms-responsibility" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">4. User Responsibility and Assumption of Risk</h3>
                    <p>You are solely responsible for entering correct data, independently verifying all results against current and official sources, determining whether any result is appropriate for the applicable operational context, and complying with all applicable aviation laws, regulations, procedures, and safety practices. You assume all risk arising from any use of the app.</p>
                  </>
                ) : (
                  <>
                    <h3 id="terms-responsibility" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">4. User Responsibility and Assumption of Risk</h3>
                    <p>You are solely responsible for your own safety while climbing or bouldering. You assume all risk arising from your participation in these activities and from any reliance on the app's features or data.</p>
                  </>
                )}

                <h3 id="terms-accuracy" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">5. Accuracy, Models, and Output Limitations</h3>
                <p>{selectedApp === 'rhumbnav' ? 'RhumbNav may rely on mathematical, geodetic, technical, and database-driven models. Differences in headings, distances, routes, times, fuel estimates, airport-related information, weather interpretation, map layers, or other outputs may occur due to selected models, rounding, user input errors, source limitations, environmental conditions, software limitations, or provider outages. Rhumb Labs does not guarantee that any output is accurate, complete, current, reliable, or fit for any particular purpose.' : 'Pogo provides statistics, logging, and achievements based on user input and internal models. Rhumb Labs does not guarantee that any calculation or data representation is perfectly accurate, complete, current, reliable, or fit for any particular purpose.'}</p>

                <h3 id="terms-accounts" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">6. Accounts and Access</h3>
                <p>Certain features may require account creation, authentication, or login through third-party providers. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Rhumb Labs may suspend or restrict access if suspicious activity, misuse, fraud, legal risk, or security concerns are detected.</p>

                <h3 id="terms-license" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">7. Limited License</h3>
                <p>Subject to these Terms, Rhumb Labs grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} for your personal or internal operational use strictly in accordance with these Terms.</p>

                <h3 id="terms-prohibited" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">8. Prohibited Uses</h3>
                <p>You may not sell, lease, sublicense, host, mirror, or otherwise commercially exploit the app except as expressly permitted by Rhumb Labs; reverse engineer or attempt to extract source code except where such restriction is prohibited by law; interfere with APIs, synchronization systems, databases, or security mechanisms; use automation in a way that overloads services; circumvent subscriptions or feature restrictions; share credentials for the purpose of extending paid access beyond authorized use; or use {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} as a certified, primary, or sole operational source where official or approved sources are legally or operationally required.</p>

                <h3 id="terms-content" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">9. User Content</h3>
                <p>You retain ownership of the data and content you create in {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}, subject to the rights reasonably necessary for Rhumb Labs and its service providers to host, process, synchronize, secure, back up, and display that content for the purpose of operating the service. You are solely responsible for the legality, reliability, and appropriateness of the content you create, upload, store, or synchronize through the app.</p>

                {selectedApp === 'rhumbnav' && (
                  <>
                    <h3 id="terms-third-party" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">10. Airport, Navigation, Weather, and Third-Party Data</h3>
                    <p>RhumbNav may use or display third-party data sources and services, including airport databases, airport frequencies, runways, radio navigation aids, countries, regions, METAR, TAF, weather products, maps, and other aviation-related services. Rhumb Labs does not control such third-party services and does not guarantee their accuracy, completeness, timeliness, availability, continuity, formatting, compatibility, pricing, or ongoing support. Third-party providers may modify, interrupt, restrict, or discontinue their services at any time.</p>
    
                    <h3 id="terms-ourairports" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">11. OurAirports Data Notice</h3>
                    <p>Certain airport-related information displayed or stored in RhumbNav may be sourced from the OurAirports datasets. OurAirports states that its data is released to the Public Domain and comes with no guarantee of accuracy or fitness for use. Any OurAirports-derived information made available through RhumbNav is provided for general reference only and must be independently verified against official, current, and operationally appropriate sources before use.</p>
    
                    <h3 id="terms-openaip" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">12. OpenAIP Data Notice</h3>
                    <p>Certain airport, airspace, navigation, or related aeronautical information displayed in RhumbNav may be sourced from OpenAIP. Because OpenAIP licensing and permitted uses may depend on the applicable dataset, plan, or separate authorization, Rhumb Labs should publish OpenAIP-derived content only where such use is permitted by the applicable license terms or a separate agreement. OpenAIP-derived content, if used, should be accompanied by the attribution and notices required by OpenAIP and must be independently verified against official, current, and operationally appropriate sources before operational use.</p>
    
                    <h3 id="terms-checkwx" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">13. CheckWX Data Notice</h3>
                    <p>Certain METAR, TAF, weather, or aviation weather-related information displayed in RhumbNav may be sourced from CheckWX or similar third-party weather services. Such information is not a substitute for official pre-flight weather briefings or any operationally required weather source. Rhumb Labs does not control those providers and does not guarantee the accuracy, completeness, timeliness, availability, continuity, formatting, compatibility, or ongoing support of any third-party weather content.</p>
    
                    <h3 id="terms-mapbox" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">14. Mapbox Maps and Attribution Notice</h3>
                    <p>Certain map displays, basemap content, map styles, tiles, or related mapping functionality in RhumbNav may be provided using Mapbox services or SDK components. Where Mapbox services are used, RhumbNav should display the attribution, wordmarks, notices, and telemetry choices required by the applicable Mapbox terms and documentation. Any Mapbox-powered map content displayed in RhumbNav is provided for general reference, planning, and support use only and must be independently verified against official, current, and operationally appropriate sources before operational use.</p>
    
                    <h3 id="terms-geographiclib" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">15. Great Circle / GeographicLib Notice</h3>
                    <p>Certain great-circle or geodesic calculations in RhumbNav may rely on GeographicLib by Charles Karney, licensed under the MIT License. The applicable license text is provided in the Open Source and Third-Party Notices section. Use of this library, or of any calculation feature in RhumbNav, does not make the app certified, approved, or suitable for primary navigation or safety-critical operational decision-making.</p>
                  </>
                )}

                <h3 id="terms-billing" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '16' : '10'}. Subscriptions, Payments, and Billing</h3>
                <p>If {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} offers paid plans, subscriptions, premium features, or in-app purchases, the applicable pricing, billing cycle, renewal terms, cancellation rules, and refund rules will be described at the point of purchase and in the Subscription and Refund Policy. Digital purchases offered through the Android app are subject to the applicable platform billing rules, including Google Play Billing where required.</p>

                <h3 id="terms-ip" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '17' : '11'}. Intellectual Property</h3>
                <p>{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}, including its design, branding, text, graphics, features, code, and content, is owned by or licensed to Rhumb Labs, except for third-party materials and components. Third-party components remain subject to their respective licenses, attribution requirements, and notices.</p>

                <h3 id="terms-warranties" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '18' : '12'}. No Warranties</h3>
                <p>To the maximum extent permitted by applicable law, {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} is provided 'AS IS' and 'AS AVAILABLE', without warranties of any kind, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular purpose, accuracy, non-infringement, availability, or reliability.</p>

                <h3 id="terms-liability" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '19' : '13'}. Limitation of Liability</h3>
                <p>To the maximum extent permitted by applicable law, Rhumb Labs and its owners, developers, affiliates, licensors, suppliers, and service providers shall not be liable for any direct, indirect, incidental, consequential, special, exemplary, or punitive damages, including flight incidents, aircraft or equipment loss or damage, personal injury or death, operational losses, data loss, service interruption, lost profits, or other economic loss arising out of or related to the use of, inability to use, or reliance upon {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}. If local law limits the exclusion or limitation of liability, this clause applies to the maximum extent permitted by that law.</p>

                <h3 id="terms-indemnification" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '20' : '14'}. Indemnification</h3>
                <p>You agree to defend, indemnify, and hold harmless Rhumb Labs and its owners, developers, affiliates, licensors, suppliers, and service providers from and against claims, liabilities, damages, losses, costs, and expenses, including reasonable legal fees, arising out of or related to your use or misuse of {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}, your violation of these Terms, your violation of any law or third-party right, or any data, content, or instructions you submit through the app.</p>

                <h3 id="terms-termination" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '21' : '15'}. Suspension and Termination</h3>
                <p>Rhumb Labs may suspend, restrict, or terminate access to {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} or certain features at any time, with or without notice, including in cases of abuse, fraud, misuse, legal risk, security concerns, non-payment where applicable, or violation of these Terms. You may stop using the app at any time.</p>

                <h3 id="terms-changes" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '22' : '16'}. Changes to These Terms</h3>
                <p>These Terms may be updated from time to time. The current version will be made available in the app, on the website, or both. Continued use of {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} after changes become effective constitutes acceptance of the revised Terms where permitted by law.</p>

                <h3 id="terms-governing" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '23' : '17'}. Governing Law and Jurisdiction</h3>
                <p>These Terms shall be governed by the laws of Chile, without regard to conflict of law principles. Any dispute arising out of or relating to these Terms or {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} shall be submitted to the courts of Santiago, Chile, unless applicable consumer law provides otherwise.</p>

                <h3 id="terms-contact" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '24' : '18'}. Contact</h3>
                <p>For support, legal, or compliance inquiries, contact: rhumblabs@gmail.com.</p>
              </div>
            </section>

            {/* 3. {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} Subscription and Refund Policy */}
            <section id="billing" className="scroll-mt-48">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">Subscription & Refund Policy</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="max-w-3xl space-y-6 text-on-surface-variant">
                <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-bold text-on-surface">Owner / Developer:</span> Rhumb Labs</div>
                    <div><span className="font-bold text-on-surface">Support Contact:</span> rhumblabs@gmail.com</div>
                    <div className="md:col-span-2"><span className="font-bold text-on-surface">Effective Date:</span> April 10, 2026</div>
                  </div>
                </div>

                <h3 id="billing-subscriptions" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">1. Subscriptions and Billing</h3>
                <p>If {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} offers paid plans, premium features, or subscriptions, they may be billed on a recurring basis (e.g., monthly or annually). By selecting a paid plan, you authorize the applicable billing provider (e.g., Google Play, Apple App Store, or a direct payment processor) to charge your payment method for the subscription fee and any applicable taxes.</p>

                <h3 id="billing-renewal" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">2. Auto-Renewal</h3>
                <p>Unless otherwise stated at the time of purchase, subscriptions automatically renew at the end of the applicable billing cycle. You must cancel your subscription before the renewal date to avoid being charged for the next cycle.</p>

                <h3 id="billing-cancellation" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">3. Cancellation</h3>
                <p>You may cancel your subscription at any time. Cancellation will stop future recurring charges, but you will retain access to the paid features until the end of your current paid billing period. To cancel a subscription purchased through a mobile app store (e.g., Google Play), you must use the subscription management tools provided by that app store. Uninstalling the app or deleting your account does not automatically cancel your subscription.</p>

                <h3 id="billing-refunds" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">4. Refunds</h3>
                <p>Except where required by applicable law, all purchases and subscription payments are non-refundable. We do not provide refunds or credits for partial billing periods, unused features, or accidental purchases. If you purchased through a mobile app store, any refund requests must be directed to that app store and are subject to their respective refund policies.</p>

                <h3 id="billing-price" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">5. Price Changes</h3>
                <p>Rhumb Labs reserves the right to change subscription prices. We will provide reasonable notice of any price changes before they take effect. If you do not agree to the new price, you must cancel your subscription before the price change goes into effect.</p>

                <h3 id="billing-trials" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">6. Free Trials</h3>
                <p>If a free trial is offered, you may be required to provide a payment method to begin the trial. Unless you cancel before the trial period ends, you will be automatically charged the applicable subscription fee at the end of the trial.</p>
              </div>
            </section>

            {/* 4. Disclaimers */}
            {selectedApp === 'rhumbnav' ? (
              <section id="aviation" className="scroll-mt-48">
                <div className="mb-12">
                  <h2 className="text-4xl font-extrabold tracking-tight mb-2">Aviation Disclaimer</h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
                </div>
                <div className="max-w-3xl space-y-6 text-on-surface-variant">
                  <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-bold text-on-surface">Owner / Developer:</span> Rhumb Labs</div>
                      <div><span className="font-bold text-on-surface">Support Contact:</span> rhumblabs@gmail.com</div>
                      <div className="md:col-span-2"><span className="font-bold text-on-surface">Effective Date:</span> April 10, 2026</div>
                    </div>
                  </div>
  
                  <h3 id="aviation-informational" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">1. For Informational, Planning, Training, and Reference Purposes Only</h3>
                  <p>RhumbNav and all information, data, outputs, calculations, map displays, weather displays, airport information, route planning tools, E6B-style calculations, logs, and related features are provided for informational, planning, training, support, and reference purposes only.</p>
  
                  <h3 id="aviation-not-substitute" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">2. Not a Substitute for Official or Certified Sources</h3>
                  <p>RhumbNav is not a substitute for official, certified, approved, or legally required aviation tools, flight planning resources, weather briefings, charts, publications, avionics, instruments, or operational procedures. It must not be used as a primary source for navigation, obstacle or terrain clearance, fuel planning where official methods are required, weather minima determination, IFR decision-making, or other safety-critical inflight decisions.</p>
  
                  <h3 id="aviation-responsibility" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">3. User Responsibility</h3>
                  <p>You are solely and entirely responsible for verifying all information against official and current sources, ensuring the legality and safety of flight operations, using correct aircraft documentation and procedures, and exercising sound aeronautical judgment at all times. Reliance on RhumbNav is solely at your own risk.</p>
  
                  <h3 id="aviation-guarantee" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">4. No Guarantee of Accuracy, Completeness, or Availability</h3>
                  <p>Rhumb Labs makes no warranty, representation, or guarantee as to the completeness, accuracy, currency, reliability, or availability of any data, model output, third-party content, airport information, weather information, mapping layer, or calculation shown in RhumbNav. Data may be delayed, outdated, incomplete, malformed, interrupted, or unavailable.</p>
  
                  <h3 id="aviation-third-party" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">5. Third-Party Data and Service Providers</h3>
                  <p>RhumbNav may rely on or display third-party services and datasets, including mapping, weather, airport, navigation, billing, and aeronautical information providers. Rhumb Labs does not control those providers and is not responsible for service interruptions, source errors, license changes, or changes in provider behavior.</p>
  
                  <h3 id="aviation-liability" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">6. Limitation of Liability</h3>
                  <p>To the maximum extent permitted by applicable law, Rhumb Labs and its affiliates, employees, contractors, licensors, and service providers shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including personal injury, death, property damage, aircraft damage, operational losses, or economic loss arising from the use of, inability to use, or reliance on RhumbNav.</p>
  
                  <h3 id="aviation-contact" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">7. Contact</h3>
                  <p>If you have questions about this Aviation Disclaimer, contact: rhumblabs@gmail.com.</p>
                </div>
              </section>
            ) : (
              <section id="climbing" className="scroll-mt-48">
                <div className="mb-12">
                  <h2 className="text-4xl font-extrabold tracking-tight mb-2">Climbing Disclaimer</h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
                </div>
                <div className="max-w-3xl space-y-6 text-on-surface-variant">
                  <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-bold text-on-surface">Owner / Developer:</span> Rhumb Labs</div>
                      <div><span className="font-bold text-on-surface">Support Contact:</span> rhumblabs@gmail.com</div>
                      <div className="md:col-span-2"><span className="font-bold text-on-surface">Effective Date:</span> April 10, 2026</div>
                    </div>
                  </div>
  
                  <h3 id="climbing-informational" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">1. For Tracking and Motivational Purposes Only</h3>
                  <p>Pogo and all information, data, outputs, calculations, logs, and related features are provided for tracking, motivational, and informational purposes only.</p>
  
                  <h3 id="climbing-danger" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">2. Inherent Dangers of Climbing</h3>
                  <p>Bouldering, rock climbing, indoor climbing, and related activities are inherently dangerous and carry a significant risk of serious injury or death. Using Pogo does not reduce these risks.</p>

                  <h3 id="climbing-responsibility" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">3. User Responsibility</h3>
                  <p>You are solely and entirely responsible for your own safety, the safety of others around you, understanding the limits of your abilities, checking your equipment, learning and practicing safe spotting and belaying techniques, and using proper judgment at all times. Reliance on Pogo is solely at your own risk.</p>
  
                  <h3 id="climbing-liability" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">4. Limitation of Liability</h3>
                  <p>To the maximum extent permitted by applicable law, Rhumb Labs and its affiliates, employees, contractors, licensors, and service providers shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including personal injury, death, property damage, operational losses, or economic loss arising from the use of, inability to use, or reliance on Pogo.</p>
  
                  <h3 id="climbing-contact" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">5. Contact</h3>
                  <p>If you have questions about this Climbing Disclaimer, contact: rhumblabs@gmail.com.</p>
                </div>
              </section>
            )}

            {/* 5. {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} Open Source and Third-Party Notices */}
            <section id="open-source" className="pb-32 scroll-mt-48">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">Open Source & Third-Party Notices</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="max-w-3xl space-y-6 text-on-surface-variant">
                <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 mb-8">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div><span className="font-bold text-on-surface">Effective Date:</span> April 10, 2026</div>
                    <div><span className="font-bold text-on-surface">Purpose:</span> These notices summarize third-party software, data, services, and publication reminders that should remain aligned with the actual released build of {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}.</div>
                  </div>
                </div>

                {selectedApp === 'rhumbnav' && (
                  <>
                    <h3 id="os-geographiclib" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">1. GeographicLib - MIT License</h3>
                    <p>Certain geodesic and great-circle-related calculations in RhumbNav may use GeographicLib by Charles Karney. The applicable MIT license text should be included in all copies or substantial portions of the software as required by that license.</p>
    
                    <h3 id="os-ourairports" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">2. OurAirports</h3>
                    <p>Certain airport-related information may be sourced from the OurAirports datasets. OurAirports states that its data is released to the Public Domain and comes with no guarantee of accuracy or fitness for use. Any OurAirports-derived information made available through RhumbNav is provided for general reference only and must be independently verified against official, current, and operationally appropriate sources before use.</p>
    
                    <h3 id="os-openaip" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">3. OpenAIP</h3>
                    <p>Certain airport, airspace, navigation, or related aeronautical information may be sourced from OpenAIP. Before publication, Rhumb Labs should verify that its actual use of OpenAIP data, including any commercial, subscription, or paid-access model, is authorized by the applicable OpenAIP license or a separate commercial agreement. OpenAIP-derived content, if used, should be accompanied by the attribution and notices required by OpenAIP and must be independently verified against official and current sources before operational use.</p>
    
                    <h3 id="os-weather" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">4. Weather Providers</h3>
                    <p>Certain METAR, TAF, or related weather information may be sourced from third-party weather providers such as CheckWX or similar services. Such information is not a substitute for official pre-flight weather briefings or any operationally required weather source.</p>
    
                    <h3 id="os-map" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">5. Map Providers</h3>
                    <p>Certain map displays, basemaps, styles, tiles, or mapping functionality may be provided using third-party mapping services such as Mapbox. Where Mapbox services are used, RhumbNav should display the attribution, wordmarks, notices, and telemetry choices required by the applicable Mapbox terms and documentation.</p>
                  </>
                )}

                <h3 id="os-firebase" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '6' : '1'}. Firebase, Authentication, and Backend Providers</h3>
                <p>If {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} uses Firebase Authentication, Cloud Firestore, crash reporting, or analytics services, the public legal pages, the in-app disclosures, and the Google Play Data safety form should describe those practices consistently and accurately.</p>

                <h3 id="os-google-play" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '7' : '2'}. Google Play Billing</h3>
                <p>If {selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} sells digital features in the Android app, billing and subscription flows should comply with Google Play Billing and the public legal pages should remain consistent with the actual purchase flow, renewal terms, and refund routing.</p>

                <h3 id="os-notes" className="text-xl font-bold text-on-surface mt-8 mb-4 scroll-mt-48">{selectedApp === 'rhumbnav' ? '8' : '3'}. Final Publication Notes</h3>
                <p>Publish each document as a separate page in the app or website for easier reference and clearer notice. Ensure the app settings or legal screen links individually to the Privacy Policy, Terms of Use, Subscription and Refund Policy, Aviation Disclaimer, and Open Source / Third-Party Notices. Keep the effective date synchronized across all published pages.</p>

                {selectedApp === 'rhumbnav' && (
                  <>
                    <h3 id="os-mit" className="text-xl font-bold text-on-surface mt-12 mb-4 scroll-mt-48">Full MIT License text - GeographicLib</h3>
                    <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 text-xs font-mono whitespace-pre-wrap">
                      Copyright (c) 2008-2023, Charles Karney{"\n\n"}
                      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:{"\n\n"}
                      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.{"\n\n"}
                      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

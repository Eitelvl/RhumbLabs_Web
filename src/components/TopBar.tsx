import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Wand2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBrandTheme } from '../context/BrandThemeContext';

export default function TopBar() {
  const location = useLocation();
  const path = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const base = (import.meta.env.BASE_URL || '/').toLowerCase().replace(/\/$/, '');
  const cleanPath = path.startsWith(base) ? path.slice(base.length) || '/' : path;

  const isLegalRoute = 
    cleanPath.includes('legal') ||
    cleanPath.includes('privacy') ||
    cleanPath.includes('terms') ||
    cleanPath.includes('delete-account') ||
    cleanPath.includes('data-deletion');

  const isHomeRoute = cleanPath === '/' || cleanPath === '';
  const isAboutRoute = cleanPath === '/about';
  const isProductsRoute = cleanPath === '/products';
  const isContactRoute = cleanPath === '/contact';
  const isRhumbNavRoute = cleanPath === '/rhumbnav';
  const isPogoRoute = cleanPath === '/pogo';

  const isFxRoute = true;
  
  const basename = import.meta.env.BASE_URL ? import.meta.env.BASE_URL.replace(/\/$/, '') : '';
  const { brandSmokeEnabled, toggleBrandSmoke } = useBrandTheme();
  
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark'; // Defaulting to dark as requested to keep current look initially
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      if (!isHomeRoute) return;
      const sections = ['home', 'about'];
      let current = 'home';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomeRoute]);

  useEffect(() => {
    if (!isHomeRoute) {
      if (isAboutRoute) setActiveSection('about');
      else if (isContactRoute) setActiveSection('contact');
      else if (isRhumbNavRoute || isPogoRoute || isProductsRoute) setActiveSection('products');
      else if (isLegalRoute) setActiveSection('legal');
      else setActiveSection('');
    }
  }, [isHomeRoute, isAboutRoute, isContactRoute, isRhumbNavRoute, isPogoRoute, isLegalRoute, isProductsRoute]);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    setIsMobileMenuOpen(false);

    if (isHomeRoute) {
      e.preventDefault();
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', sectionId === 'home' ? '/' : `#${sectionId}`);
      }, 50);
    }
  };

  const getLinkClasses = (section: string) => {
    const isActive = activeSection === section;
    return `text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'text-text-primary drop-shadow-md' 
        : 'text-text-secondary hover:text-text-primary'
    }`;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle py-3' : 'bg-transparent py-5'}`}>
      <div className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="logo-container flex items-center group relative h-12 w-48 md:w-64 -ml-4 md:-ml-6">
            <img src={`${import.meta.env.BASE_URL}rhumb-labs-logo.png`} alt="Rhumb Labs" className="w-[150px] md:w-[200px] h-auto object-contain scale-[1.1] md:scale-[1.2] origin-left translate-y-0.5" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 bg-card-element border border-card-border backdrop-blur-md rounded-full px-6 py-2 shadow-2xl relative">
          <Link to="/#home" onClick={(e) => scrollToSection(e, 'home')} className={getLinkClasses('home')}>Home</Link>
          <div className="relative group">
            <Link to="/products" className={`${getLinkClasses('products')} flex items-center gap-1`}>
              Products
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 transition-transform group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
              <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-2 w-48 shadow-2xl flex flex-col gap-1">
                <Link to="/rhumbnav" className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-card-element transition-colors">RhumbNav</Link>
                <Link to="/pogo" className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-card-element transition-colors">Pogo</Link>
              </div>
            </div>
          </div>
          <Link to="/about" className={getLinkClasses('about')}>About</Link>
          <Link to="/legal" className={getLinkClasses('legal')}>Legal</Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
           {isFxRoute && (
             <button 
               onClick={toggleBrandSmoke} 
               className={`p-2 rounded-full border transition-all duration-300 ${
                 brandSmokeEnabled 
                   ? 'bg-gradient-to-r from-purple-950/80 to-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]' 
                   : 'bg-card-element border-card-border text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
               }`}
               aria-label="Toggle FX"
               title={brandSmokeEnabled ? 'Efecto FX: ACTIVADO' : 'Efecto FX: DESACTIVADO'}
             >
               <Wand2 className={`w-4 h-4 ${brandSmokeEnabled ? 'text-cyan-400 animate-pulse' : ''}`} />
             </button>
           )}

           <button onClick={toggleTheme} className="p-2 rounded-full border border-card-border bg-card-element text-text-primary hover:bg-bg-secondary transition-colors" aria-label="Toggle Theme" title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
             {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
           <Link to="/contact" className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
             brandSmokeEnabled
               ? 'brand-btn-primary'
               : 'bg-accent text-accent-foreground hover:opacity-80 shadow-[0_0_20px_var(--shadow-btn)]'
           }`}>
             Get in Touch
           </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {isFxRoute && (
            <button 
              onClick={toggleBrandSmoke} 
              className={`p-2 rounded-full border transition-all duration-300 ${
                brandSmokeEnabled 
                  ? 'bg-purple-950/50 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                  : 'bg-card-element border-card-border text-text-secondary hover:bg-bg-secondary'
              }`}
              aria-label="Toggle FX"
              title={brandSmokeEnabled ? 'Efecto FX: ACTIVADO' : 'Efecto FX: DESACTIVADO'}
            >
              <Wand2 className={`w-4 h-4 ${brandSmokeEnabled ? 'text-cyan-400' : ''}`} />
            </button>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full border border-card-border bg-card-element text-text-primary hover:bg-bg-secondary transition-colors" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            className="text-text-primary bg-card-element border border-card-border rounded-full p-2 hover:bg-bg-secondary transition-colors" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-secondary border-b border-border-subtle overflow-hidden"
          >
            <div className="py-6 px-6 flex flex-col gap-4">
              <Link to="/#home" onClick={(e) => scrollToSection(e, 'home')} className="text-xl font-medium text-text-secondary hover:text-text-primary">Home</Link>
              <div className="flex flex-col gap-2">
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-text-secondary hover:text-text-primary">Products</Link>
                <div className="flex flex-col gap-2 pl-4 border-l-2 border-border-subtle ml-2">
                  <Link to="/rhumbnav" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-secondary hover:text-text-primary">RhumbNav</Link>
                  <Link to="/pogo" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-secondary hover:text-text-primary">Pogo</Link>
                </div>
              </div>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-text-secondary hover:text-text-primary">About</Link>
              <Link to="/legal" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-text-secondary hover:text-text-primary">Legal</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-text-secondary hover:text-text-primary">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

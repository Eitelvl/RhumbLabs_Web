import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TopBar() {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const isContactRoute = location.pathname === '/contact';
  const isRhumbNavRoute = location.pathname === '/rhumbnav';
  
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHomeRoute) {
      if (isContactRoute) setActiveSection('contact');
      else if (isRhumbNavRoute) setActiveSection('products');
      else setActiveSection(''); // Clear selection for other routes like /legal
      return;
    }

    const handleScroll = () => {
      const sections = ['home', 'products', 'about'];
      let current = 'home';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is above the middle of the viewport
          if (rect.top <= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomeRoute, isContactRoute]);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    if (isHomeRoute) {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', sectionId === 'home' ? '/' : `#${sectionId}`);
      setIsMobileMenuOpen(false);
    }
  };

  const getLinkClasses = (section: string, isMobile = false) => {
    const isActive = activeSection === section;
    if (isMobile) {
      return `block w-full text-left px-6 py-4 text-lg font-semibold transition-colors ${
        isActive ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
      }`;
    }
    return `font-semibold font-manrope tracking-tight transition-colors ${
      isActive 
        ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' 
        : 'text-slate-400 hover:text-slate-100'
    }`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,229,255,0.08)]">
      <div className="flex justify-between items-center px-8 py-4 md:py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center h-12 md:h-16 mt-2 md:mt-4">
            <img src="/Logo_RhumbLabs2.png" alt="Rhumb Labs" className="h-full w-auto object-contain scale-[2.5] md:scale-[3.5] origin-center md:origin-left md:-translate-x-24" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/#home" onClick={(e) => scrollToSection(e, 'home')} className={getLinkClasses('home')}>Home</Link>
          <Link to="/#products" onClick={(e) => scrollToSection(e, 'products')} className={getLinkClasses('products')}>Products</Link>
          <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')} className={getLinkClasses('about')}>About</Link>
          <Link to="/contact" className={getLinkClasses('contact')}>Contact</Link>
        </div>

        {/* Mobile Menu Button (Right) */}
        <div className="md:hidden flex items-center">
          <button 
            className="text-slate-400 hover:text-cyan-400 transition-colors p-2 -mr-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
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
            className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 overflow-hidden"
          >
            <div className="py-2">
              <Link to="/#home" onClick={(e) => scrollToSection(e, 'home')} className={getLinkClasses('home', true)}>Home</Link>
              <Link to="/#products" onClick={(e) => scrollToSection(e, 'products')} className={getLinkClasses('products', true)}>Products</Link>
              <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')} className={getLinkClasses('about', true)}>About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClasses('contact', true)}>Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

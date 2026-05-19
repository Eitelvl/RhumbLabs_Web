import { Link, useLocation } from 'react-router-dom';
import RhumbLabsLogo from './RhumbLabsLogo';
import { Menu, X, Sun, Moon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TopBar() {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const isContactRoute = location.pathname === '/contact';
  const isRhumbNavRoute = location.pathname === '/rhumbnav';
  const isPogoRoute = location.pathname === '/pogo';
  
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
      const sections = ['home', 'products', 'about'];
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
      if (isContactRoute) setActiveSection('contact');
      else if (isRhumbNavRoute || isPogoRoute) setActiveSection('products');
      else setActiveSection('');
    }
  }, [isHomeRoute, isContactRoute, isRhumbNavRoute, isPogoRoute]);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    if (isHomeRoute) {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', sectionId === 'home' ? '/' : `#${sectionId}`);
      setIsMobileMenuOpen(false);
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
            <img src="/pogo/RL1N.png" alt="Rhumb Labs" className="show-in-light w-[150px] md:w-[200px] h-auto object-contain scale-[1.1] md:scale-[1.2] origin-left translate-y-0.5" />
            <img src="/pogo/RL1.png" alt="Rhumb Labs" className="show-in-dark w-[150px] md:w-[200px] h-auto object-contain scale-[1.1] md:scale-[1.2] origin-left translate-y-0.5" />

          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 bg-card-element border border-card-border backdrop-blur-md rounded-full px-6 py-2 shadow-2xl">
          <Link to="/#home" onClick={(e) => scrollToSection(e, 'home')} className={getLinkClasses('home')}>Home</Link>
          <Link to="/#products" onClick={(e) => scrollToSection(e, 'products')} className={getLinkClasses('products')}>Products</Link>
          <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')} className={getLinkClasses('about')}>About</Link>
          <div className="w-px h-4 bg-card-border mx-2"></div>
          <Link to="/contact" className={getLinkClasses('contact')}>Contact</Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
           <button onClick={toggleTheme} className="p-2 rounded-full border border-card-border bg-card-element text-text-primary hover:bg-bg-secondary transition-colors" aria-label="Toggle Theme">
             {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
           <Link to="/contact" className="px-5 py-2 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:opacity-80 transition-opacity shadow-[0_0_20px_var(--shadow-btn)]">
             Get in touch
           </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
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
              <Link to="/#products" onClick={(e) => scrollToSection(e, 'products')} className="text-xl font-medium text-text-secondary hover:text-text-primary">Products</Link>
              <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')} className="text-xl font-medium text-text-secondary hover:text-text-primary">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-text-secondary hover:text-text-primary">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

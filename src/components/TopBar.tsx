import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
        ? 'text-white drop-shadow-md' 
        : 'text-[#8A8F98] hover:text-white'
    }`;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0b0d]/80 backdrop-blur-xl border-b border-white/[0.04] py-3' : 'bg-transparent py-5'}`}>
      <div className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center group relative h-12 w-48 md:w-64 -ml-4 md:-ml-6">
            <img src="/RL1.png" alt="Rhumb Labs" className="w-[150px] md:w-[200px] h-auto object-contain scale-[1.1] md:scale-[1.2] origin-left translate-y-0.5" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-6 py-2 shadow-2xl">
          <Link to="/#home" onClick={(e) => scrollToSection(e, 'home')} className={getLinkClasses('home')}>Home</Link>
          <Link to="/#products" onClick={(e) => scrollToSection(e, 'products')} className={getLinkClasses('products')}>Products</Link>
          <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')} className={getLinkClasses('about')}>About</Link>
          <div className="w-px h-4 bg-white/20 mx-2"></div>
          <Link to="/contact" className={getLinkClasses('contact')}>Contact</Link>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center">
           <Link to="/contact" className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#e0e5f4] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]">
             Get in touch
           </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            className="text-white bg-white/5 border border-white/10 rounded-full p-2 hover:bg-white/10 transition-colors" 
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
            className="md:hidden bg-[#0a0b0d] border-b border-white/[0.04] overflow-hidden"
          >
            <div className="py-6 px-6 flex flex-col gap-4">
              <Link to="/#home" onClick={(e) => scrollToSection(e, 'home')} className="text-xl font-medium text-white/80 hover:text-white">Home</Link>
              <Link to="/#products" onClick={(e) => scrollToSection(e, 'products')} className="text-xl font-medium text-white/80 hover:text-white">Products</Link>
              <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')} className="text-xl font-medium text-white/80 hover:text-white">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-white/80 hover:text-white">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

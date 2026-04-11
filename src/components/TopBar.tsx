import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface TopBarProps {
  onMobileMenuClick?: () => void;
}

export default function TopBar({ onMobileMenuClick }: TopBarProps) {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const isContactRoute = location.pathname === '/contact';
  
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    if (!isHomeRoute) {
      if (isContactRoute) setActiveSection('contact');
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
    }
  };

  const getLinkClasses = (section: string) => {
    const isActive = activeSection === section;
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
          {onMobileMenuClick && (
            <button className="md:hidden text-slate-400 hover:text-cyan-400" onClick={onMobileMenuClick}>
              <Menu className="w-6 h-6" />
            </button>
          )}
          <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center h-12 md:h-16">
            <img src="/Logo_RhumbLabs2.png" alt="Rhumb Labs" className="h-full w-auto object-contain scale-[2.5] md:scale-[3.5] origin-left -translate-x-10 md:-translate-x-16" />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <Link to="/#home" onClick={(e) => scrollToSection(e, 'home')} className={getLinkClasses('home')}>Home</Link>
          <Link to="/#products" onClick={(e) => scrollToSection(e, 'products')} className={getLinkClasses('products')}>Products</Link>
          <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')} className={getLinkClasses('about')}>About</Link>
          <Link to="/contact" className={getLinkClasses('contact')}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}

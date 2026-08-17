import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAssetUrl } from '../utils/assets';
import { SafeImage } from './SafeImage';

export default function Footer() {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

  const basename = import.meta.env.BASE_URL ? import.meta.env.BASE_URL.replace(/\/$/, '') : '';

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (isHomeRoute) {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', sectionId === 'home' ? basename + '/' : basename + `/#${sectionId}`);
    }
  };

  return (
    <footer className="bg-transparent relative z-10 border-t border-border-subtle w-full py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-xs flex justify-center md:justify-start">
            <a href={`${basename}/`} onClick={(e) => scrollToSection(e, 'home')} className="flex items-center group relative h-16 md:h-20 w-56 md:w-72 -ml-6 md:-ml-8">
              <SafeImage src={getAssetUrl('rhumb-labs-logo.png')} alt="Rhumb Labs" className="w-[200px] md:w-[280px] h-auto object-contain scale-[1.3] md:scale-[1.5] origin-left" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24 w-full md:w-auto">
            <div>
              <span className="text-[11px] font-semibold text-text-primary uppercase tracking-widest block mb-4">Company</span>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-text-secondary hover:text-text-primary transition-colors text-[13px]">About Us</Link></li>
                <li><Link to="/contact" className="text-text-secondary hover:text-text-primary transition-colors text-[13px]">Contact</Link></li>
              </ul>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-text-primary uppercase tracking-widest block mb-4">Products</span>
              <ul className="space-y-3">
                <li><Link to="/rhumbnav" className="text-text-secondary hover:text-text-primary transition-colors text-[13px]">RhumbNav</Link></li>
                <li><Link to="/pogo" className="text-text-secondary hover:text-text-primary transition-colors text-[13px]">Pogo</Link></li>
              </ul>
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <span className="text-[11px] font-semibold text-text-primary uppercase tracking-widest block mb-4">Legal & Privacy</span>
              <ul className="space-y-3">
                <li><Link to="/legal" className="text-text-secondary hover:text-text-primary transition-colors text-[13px]">Legal Center</Link></li>
                <li><Link to="/delete-account" className="text-text-secondary hover:text-text-primary transition-colors text-[13px]">Data Deletion</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-card-border pt-8 gap-6 md:gap-4">
          <span className="text-text-secondary text-[13px]">© {new Date().getFullYear()} Rhumb Labs. All rights reserved.</span>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-text-secondary text-[13px]">
            <Link to="/legal/company-legal" className="hover:text-text-primary transition-colors">Company Legal</Link>
            <span className="text-text-secondary/50 hidden md:inline">·</span>
            <Link to="/legal/company-privacy" className="hover:text-text-primary transition-colors">Company Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

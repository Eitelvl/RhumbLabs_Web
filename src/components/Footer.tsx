import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (isHomeRoute) {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', sectionId === 'home' ? '/' : `#${sectionId}`);
    }
  };

  return (
    <footer className="bg-slate-950 w-full py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 mb-12">
          <div className="max-w-xs flex justify-center md:justify-start">
            <Link to="/" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center h-16 md:h-20">
              <img src="/RL1.png" alt="Rhumb Labs" className="h-full w-auto object-left object-contain scale-[3] md:scale-[4] origin-center md:origin-left md:-translate-x-12" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-6">Company</span>
              <ul className="space-y-3">
                <li><Link to="/#about" onClick={(e) => scrollToSection(e, 'about')} className="text-slate-500 hover:text-slate-200 transition-colors text-sm uppercase tracking-widest">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-500 hover:text-slate-200 transition-colors text-sm uppercase tracking-widest">Contact</Link></li>
              </ul>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-6">Legal</span>
              <ul className="space-y-3">
                <li><Link to="/legal" className="text-slate-500 hover:text-slate-200 transition-colors text-sm uppercase tracking-widest">RhumbNav</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-t border-slate-800/50 pt-8 gap-3">
          <span className="text-slate-500 text-[10px] font-inter uppercase tracking-widest text-center">© 2026 Rhumb Labs. All rights reserved.</span>
          <div className="flex items-center gap-3 text-slate-500 text-[10px] font-inter uppercase tracking-widest">
            <Link to="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

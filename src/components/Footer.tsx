import { Globe, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 w-full py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="max-w-xs">
            <Link to="/" className="block mb-6 h-16 md:h-24">
              <img src="/Logo_RhumbLabs2.png" alt="Rhumb Labs" className="h-full w-auto object-contain scale-[2.5] md:scale-[3.5] origin-left -translate-x-16 md:-translate-x-24" />
            </Link>
            <a href="mailto:support@rhumblabs.com" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors font-inter">
              support@rhumblabs.com
            </a>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-6">Company</span>
              <ul className="space-y-3">
                <li><Link to="/" className="text-slate-500 hover:text-slate-200 transition-colors text-sm uppercase tracking-widest">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-500 hover:text-slate-200 transition-colors text-sm uppercase tracking-widest">Contact</Link></li>
              </ul>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-6">Legal</span>
              <ul className="space-y-3">
                <li><Link to="/legal" className="text-slate-500 hover:text-slate-200 transition-colors text-sm uppercase tracking-widest">Terms of Use</Link></li>
                <li><Link to="/legal" className="text-slate-500 hover:text-slate-200 transition-colors text-sm uppercase tracking-widest">Privacy Policy</Link></li>
                <li><Link to="/legal" className="text-slate-500 hover:text-slate-200 transition-colors text-sm uppercase tracking-widest">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-800/50 pt-8 gap-8">
          <span className="text-slate-500 text-sm font-inter uppercase tracking-widest">© 2026 Rhumb Labs. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><AtSign className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

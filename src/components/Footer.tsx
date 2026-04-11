import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 w-full py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 mb-12">
          <div className="max-w-xs flex justify-center md:justify-start">
            <Link to="/" className="block h-16 md:h-20">
              <img src="/Logo_RhumbLabs2.png" alt="Rhumb Labs" className="h-full w-auto object-contain scale-[2.5] md:scale-[3.5] origin-center md:origin-left md:-translate-x-24" />
            </Link>
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
        <div className="flex flex-col items-center justify-center border-t border-slate-800/50 pt-8 gap-6">
          <span className="text-slate-500 text-sm font-inter uppercase tracking-widest text-center">© 2026 Rhumb Labs. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

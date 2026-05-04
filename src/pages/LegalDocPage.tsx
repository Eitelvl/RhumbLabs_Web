import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { ArrowLeft, FileText, ChevronRight } from 'lucide-react';

export default function LegalDocPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  // Format the title from the path
  const rawTitle = pathParts[pathParts.length - 1] || 'Document';
  // format 'privacy-policy' -> 'Privacy Policy'
  const title = rawTitle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  // Determine subtitle/context
  let subtitle = 'Rhumb Labs';
  if (pathParts.includes('rhumbnav')) subtitle = 'RhumbNav';
  else if (pathParts.includes('pogo')) subtitle = 'Pogo';

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <Link 
          to="/legal" 
          className="inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Legal Center
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] mb-4">
            <Link to="/legal" className="hover:text-white transition-colors">Legal Center</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{subtitle}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {title}
          </h1>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="linear-card p-12 md:p-24 rounded-3xl bg-black border border-white/10 text-center relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <FileText className="w-10 h-10 text-[#a1a1aa]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <p className="text-lg text-[#a1a1aa] font-light mb-10 max-w-md mx-auto leading-relaxed">
            This document will be available soon. Please check back later or contact support if you have immediate questions.
          </p>
          <Link 
            to="/legal" 
            className="linear-button-secondary px-8 py-3 text-sm font-medium inline-flex items-center justify-center rounded-xl"
          >
            Return to Legal Center
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

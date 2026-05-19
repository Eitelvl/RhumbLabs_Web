import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Scale, ChevronRight, Shield, Building2, Map as MapIcon, Activity } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-16 md:mb-24 mt-8 md:mt-12 max-w-3xl">
          <div className="w-16 h-16 bg-card-element rounded-2xl flex items-center justify-center mb-8 border border-card-border shadow-[inset_0_1px_1px_var(--border-subtle)]">
            <Scale className="w-8 h-8 text-text-primary" />
          </div>
          <h1 className="text-4xl md:text-[3.5rem] font-bold tracking-tight mb-6 leading-tight text-text-primary">
            Legal Center
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed">
            Find legal documents, privacy policies, terms, disclaimers, and notices for Rhumb Labs and its products.
          </p>
        </header>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Rhumb Labs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="linear-card p-8 rounded-3xl bg-bg-primary border border-card-border shadow-[0_20px_60px_var(--shadow-medium)] flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-card-border">
              <div className="p-3 bg-card-element rounded-xl border border-card-border">
                <Building2 className="w-6 h-6 text-text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Rhumb Labs</h2>
            </div>
            <div className="space-y-2 flex-grow">
              <LegalLink to="/legal/company-legal" title="Company Legal" />
              <LegalLink to="/legal/company-privacy" title="Company Privacy" />
            </div>
          </motion.div>

          {/* RhumbNav */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="linear-card p-8 rounded-3xl bg-bg-primary border border-[#11A8FD]/20 shadow-[0_20px_60px_rgba(17,168,253,0.05)] flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#11A8FD]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-card-border relative z-10">
              <div className="p-3 bg-[#11A8FD]/10 rounded-xl border border-[#11A8FD]/20">
                <MapIcon className="w-6 h-6 text-[#11A8FD]" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">RhumbNav</h2>
            </div>
            <div className="space-y-2 flex-grow relative z-10">
              <LegalLink to="/legal/rhumbnav/privacy-policy" title="Privacy Policy" />
              <LegalLink to="/legal/rhumbnav/terms-of-use" title="Terms of Use" />
              <LegalLink to="/legal/rhumbnav/subscription-refund-policy" title="Subscription & Refund Policy" />
              <LegalLink to="/legal/rhumbnav/aviation-disclaimer" title="Aviation Disclaimer" />
              <LegalLink to="/legal/rhumbnav/third-party-notices" title="Third Party Notices" />
            </div>
          </motion.div>

          {/* Pogo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="linear-card p-8 rounded-3xl bg-bg-primary border border-[#7C3AED]/20 shadow-[0_20px_60px_rgba(124,58,237,0.05)] flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-card-border relative z-10">
              <div className="p-3 bg-[#7C3AED]/10 rounded-xl border border-[#7C3AED]/20">
                <Activity className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Pogo</h2>
            </div>
            <div className="space-y-2 flex-grow relative z-10">
              <LegalLink to="/legal/pogo/privacy-policy" title="Privacy Policy" />
              <LegalLink to="/legal/pogo/terms-of-use" title="Terms of Use" />
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function LegalLink({ to, title }: { to: string; title: string }) {
  return (
    <Link 
      to={to} 
      className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-card-border bg-transparent hover:bg-card-element transition-colors group"
    >
      <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{title}</span>
      <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-text-secondary transition-colors" />
    </Link>
  );
}

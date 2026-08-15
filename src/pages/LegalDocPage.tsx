import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { ArrowLeft, FileText, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Load all markdown files from /src/data/legal
const docs = import.meta.glob('/src/data/legal/*.md', { query: '?raw', import: 'default', eager: true });

export default function LegalDocPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  // Format the title and strip any .html suffix
  let rawTitle = pathParts[pathParts.length - 1] || 'Document';
  rawTitle = rawTitle.replace(/\.html$/i, '');
  
  // Handle common shorthand aliases
  if (rawTitle === 'privacy') rawTitle = 'privacy-policy';
  if (rawTitle === 'terms') rawTitle = 'terms-of-use';
  if (rawTitle === 'refund') rawTitle = 'subscription-refund-policy';
  if (rawTitle === 'aviation') rawTitle = 'aviation-disclaimer';

  // Determine product context
  const isRhumbNav = pathParts.some(p => p.toLowerCase().includes('rhumbnav'));
  const isPogo = pathParts.some(p => p.toLowerCase().includes('pogo'));
  const isCompany = pathParts.some(p => p.toLowerCase().includes('company'));

  let subtitle = 'Rhumb Labs';
  let filenamePrefix = '';
  if (isRhumbNav) {
    subtitle = 'RhumbNav';
    filenamePrefix = 'rhumbnav-';
  } else if (isPogo) {
    subtitle = 'Pogo';
    filenamePrefix = 'pogo-';
  } else if (isCompany) {
    subtitle = 'Rhumb Labs';
    filenamePrefix = 'company-';
  }

  // Format title for display
  const displayTitle = rawTitle
    .replace(/^(pogo-|rhumbnav-|company-)/i, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(' Of ', ' of ')
    .replace(' And ', ' & ');

  // Search through all loaded markdown docs
  // Candidate 1: /src/data/legal/${filenamePrefix}${cleanTitle}.md
  // Candidate 2: /src/data/legal/${cleanTitle}.md
  // Candidate 3: Fuzzy matching across doc keys
  const cleanTitle = rawTitle.replace(/^(pogo-|rhumbnav-|company-)/i, '');
  
  let content: string | null = null;
  const pathCandidates = [
    `/src/data/legal/${filenamePrefix}${cleanTitle}.md`,
    `/src/data/legal/${rawTitle}.md`,
    `/src/data/legal/${cleanTitle}.md`,
  ];

  for (const candidate of pathCandidates) {
    if (docs[candidate]) {
      content = docs[candidate] as string;
      break;
    }
  }

  if (!content) {
    // Try fuzzy match
    const entries = Object.entries(docs);
    for (const [key, value] of entries) {
      const lowerKey = key.toLowerCase();
      const lowerClean = cleanTitle.toLowerCase();
      if (
        (isPogo && lowerKey.includes('pogo') && lowerKey.includes(lowerClean)) ||
        (isRhumbNav && lowerKey.includes('rhumbnav') && lowerKey.includes(lowerClean)) ||
        (lowerKey.includes(lowerClean))
      ) {
        content = value as string;
        break;
      }
    }
  }

  const loading = false;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <Link 
          to="/legal" 
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Legal Center
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-4">
            <Link to="/legal" className="hover:text-text-primary transition-colors"></Link>
            <ChevronRight className="w-3 h-3" />
            <span>{subtitle}</span>
          </div>
        </header>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-card-element rounded w-1/3"></div>
            <div className="h-4 bg-card-element rounded w-1/4 mb-10"></div>
            <div className="h-4 bg-card-element rounded w-full"></div>
            <div className="h-4 bg-card-element rounded w-full"></div>
            <div className="h-4 bg-card-element rounded w-5/6"></div>
          </div>
        ) : content ? (
          <>
            <div className="markdown-body prose dark:prose-invert prose-slate max-w-none 
                            prose-headings:text-text-primary prose-p:text-text-secondary prose-li:text-text-secondary
                            prose-a:text-[#11A8FD] hover:prose-a:text-[#11A8FD]/80
                            prose-strong:text-text-primary prose-strong:font-medium">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
            
            <div className="mt-16 flex justify-center">
              <Link 
                to="/legal" 
                className="linear-button-secondary px-8 py-3 text-sm font-medium inline-flex items-center justify-center rounded-xl"
              >
                Return to Legal Center
              </Link>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="linear-card p-12 md:p-24 rounded-3xl bg-bg-primary border border-card-border text-center relative overflow-hidden"
          >
            <div className="w-20 h-20 bg-card-element rounded-2xl flex items-center justify-center mx-auto mb-8 border border-card-border shadow-[inset_0_1px_1px_var(--border-subtle)]">
              <FileText className="w-10 h-10 text-text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{displayTitle}</h3>
            <p className="text-lg text-text-secondary font-light mb-10 max-w-md mx-auto leading-relaxed">
              This document will be available soon. Please check back later or contact support if you have immediate questions.
            </p>
            <Link 
              to="/legal" 
              className="linear-button-secondary px-8 py-3 text-sm font-medium inline-flex items-center justify-center rounded-xl"
            >
              Return to Legal Center
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

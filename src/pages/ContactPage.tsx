import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col justify-between">
      <TopBar />
      
      <main className="flex-1 pt-24 pb-12 px-6 lg:px-12 flex flex-col justify-center items-center my-auto">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column - Info wrapped in glass card */}
          <div className="lg:col-span-5">
            <div className="p-6 md:p-8 rounded-2xl bg-bg-primary/85 backdrop-blur-xl border border-card-border shadow-[0_15px_40px_var(--shadow-heavy)]">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[10px] uppercase font-bold text-cyan-300 mb-4 tracking-widest">
                  <span>Connect</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight text-text-primary font-headline">
                  Get in <span className="text-cyan-400">touch.</span>
                </h1>
                <p className="text-base text-gray-200 leading-relaxed font-normal mb-6">
                  For questions, ideas, feedback, support, or business inquiries, feel free to reach out to the Rhumb Labs team.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="grid grid-cols-1 gap-3.5"
              >
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-card-border bg-card-element/80">
                  <div className="p-2.5 bg-cyan-500/10 rounded-full border border-cyan-500/30 shrink-0">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Contact</h3>
                    <a href="mailto:support@rhumblabs.com" className="text-sm text-white font-semibold hover:text-cyan-300 transition-colors">support@rhumblabs.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-card-border bg-card-element/80">
                  <div className="p-2.5 bg-cyan-500/10 rounded-full border border-cyan-500/30 shrink-0">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Based in</h3>
                    <p className="text-sm text-white font-semibold">Santiago de Chile</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Compact Card */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="linear-card p-6 md:p-8 rounded-2xl bg-bg-primary/90 backdrop-blur-xl border border-card-border shadow-[0_15px_40px_var(--shadow-heavy)]">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-card-border">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-1">Contact Rhumb Labs</h2>
                  <p className="text-xs md:text-sm text-gray-200 font-normal">Direct email support &amp; inquiries</p>
                </div>
                <a 
                  href="mailto:support@rhumblabs.com"
                  className="brand-btn-primary px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold tracking-wide rounded-full shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-transform"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">Quick Inquiries</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <a href="mailto:support@rhumblabs.com?subject=Privacy%20Request" className="flex items-center justify-between p-2.5 rounded-lg border border-card-border bg-card-element/90 hover:bg-card-border hover:border-cyan-500/40 transition-colors group">
                      <span className="text-xs text-white font-semibold group-hover:text-cyan-300">Privacy</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-cyan-300 transition-colors" />
                    </a>
                    <a href="mailto:support@rhumblabs.com?subject=Business%20Inquiry" className="flex items-center justify-between p-2.5 rounded-lg border border-card-border bg-card-element/90 hover:bg-card-border hover:border-cyan-500/40 transition-colors group">
                      <span className="text-xs text-white font-semibold group-hover:text-cyan-300">Business</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-cyan-300 transition-colors" />
                    </a>
                    <a href="mailto:support@rhumblabs.com?subject=App%20Support" className="flex items-center justify-between p-2.5 rounded-lg border border-card-border bg-card-element/90 hover:bg-card-border hover:border-cyan-500/40 transition-colors group">
                      <span className="text-xs text-white font-semibold group-hover:text-cyan-300">App Support</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-cyan-300 transition-colors" />
                    </a>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Account &amp; Data Deletion</h3>
                    <Link to="/delete-account" className="text-[10px] font-semibold text-cyan-400 hover:underline">
                      Deletion Hub &rarr;
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Link to="/rhumbnav/delete-account" className="flex items-center justify-between p-3 rounded-xl border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 transition-colors group">
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-sky-200 font-semibold">RhumbNav Account Deletion</span>
                        <span className="text-[10px] text-gray-300 font-normal">Flight logbook data deletion</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-sky-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
                    </Link>

                    <Link to="/pogo/delete-account" className="flex items-center justify-between p-3 rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/15 hover:bg-fuchsia-500/25 transition-colors group">
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-fuchsia-200 font-semibold">Pogo Account Deletion</span>
                        <span className="text-[10px] text-gray-300 font-normal">Climbing profile data deletion</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-fuchsia-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

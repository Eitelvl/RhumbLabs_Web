import React from 'react';
import { motion } from 'motion/react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column - Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant/30 bg-surface-container-low/50 text-[10px] uppercase font-bold text-slate-300 mb-8 tracking-widest">
                <span>Connect</span>
              </div>
              <h1 className="text-5xl md:text-[5.5rem] font-medium tracking-tight mb-8 leading-[0.9] text-white">
                Get in <span className="text-[#a1a1aa]">touch.</span>
              </h1>
              <p className="text-xl text-[#a1a1aa] max-w-md leading-relaxed font-light mb-12">
                For questions, ideas, feedback, support, or business inquiries, feel free to reach out to the Rhumb Labs team.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-full border border-white/10">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Contact</h3>
                  <a href="mailto:support@rhumblabs.com" className="text-slate-200 font-medium hover:text-white transition-colors">support@rhumblabs.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-full border border-white/10">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Based in</h3>
                  <p className="text-slate-200 font-medium">Santiago de Chile</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Static Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            
            <div className="linear-card p-8 md:p-12 rounded-3xl bg-black border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Rhumb Labs</h3>
                <p className="text-[#a1a1aa] font-light leading-relaxed mb-6">
                  For support, privacy requests, business inquiries, or app-related questions, you can reach the Rhumb Labs team by email.
                </p>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <a href="mailto:support@rhumblabs.com" className="flex-1 text-lg font-medium text-white truncate pr-4">
                    support@rhumblabs.com
                  </a>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                </div>

                <a 
                  href="mailto:support@rhumblabs.com"
                  className="linear-button-primary w-full h-12 flex items-center justify-center text-sm tracking-wide font-medium rounded-xl mb-8"
                >
                  Send Email
                </a>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specific Inquiries</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href="mailto:support@rhumblabs.com?subject=Privacy%20Request" className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors group">
                      <span className="text-sm text-slate-300 font-medium">Privacy Request</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </a>
                    <a href="mailto:support@rhumblabs.com?subject=Business%20Inquiry" className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors group">
                      <span className="text-sm text-slate-300 font-medium">Business Inquiry</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </a>
                    <a href="mailto:support@rhumblabs.com?subject=App%20Support" className="sm:col-span-2 flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors group">
                      <span className="text-sm text-slate-300 font-medium">App Support</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-6 text-center max-w-sm mx-auto font-light leading-relaxed">
              For privacy or data deletion requests, please include the app name and the email associated with your account, if applicable.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

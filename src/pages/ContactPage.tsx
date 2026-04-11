import { useState } from 'react';
import { motion } from 'motion/react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 pt-40 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column - Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.05]">
                Get in <span className="text-primary">touch.</span>
              </h1>
              <p className="text-xl text-on-surface-variant max-w-md leading-relaxed font-light mb-12">
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
                <div className="p-3 bg-surface-container-highest rounded-lg border border-outline-variant/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-1">Contact</h3>
                  <p className="text-slate-400">support@rhumblabs.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-surface-container-highest rounded-lg border border-outline-variant/10">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-1">Based in</h3>
                  <p className="text-slate-400">Santiago de Chile</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/5 blur-[80px] -z-10 rounded-full"></div>
            <div className="glass-panel p-8 md:p-12 rounded-2xl border border-outline-variant/20 cyan-glow bg-surface/40 backdrop-blur-2xl">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Message Sent</h3>
                  <p className="text-slate-400">We will get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 px-6 py-2 border border-outline-variant/20 rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input type="text" required className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company</label>
                      <input type="text" className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" placeholder="Acme Corp" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" required className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" placeholder="john@acmecorp.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message</label>
                    <textarea rows={4} required className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none" placeholder="How can we help you?"></textarea>
                  </div>
                  <button type="submit" className="w-full h-14 mt-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary-container font-bold rounded-lg hover:shadow-[0_0_20px_rgba(129,236,255,0.4)] transition-all text-lg tracking-wide">
                    Submit
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

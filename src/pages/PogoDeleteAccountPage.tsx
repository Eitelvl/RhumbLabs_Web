import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Mail, ArrowLeft, Trash2, Smartphone } from 'lucide-react';

export default function PogoDeleteAccountPage() {
  useEffect(() => {
    document.title = "Pogo Account Deletion | RhumbLabs";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Request deletion of your Pogo account and associated data.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Request deletion of your Pogo account and associated data.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 pt-32 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link to="/contact" className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors text-sm font-medium mb-12 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Contact
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant/30 bg-surface-container-low/50 text-[10px] uppercase font-bold text-text-secondary mb-6 tracking-widest">
              <span>Account Management</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-text-primary">
              Pogo account deletion
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-16"
          >
            <div className="space-y-8 pb-16">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* App Deletion */}
                <div className="linear-card p-6 md:p-8 rounded-3xl bg-surface-container-low/30 border border-card-border flex flex-col items-start h-full">
                  <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 mb-6 shrink-0">
                    <Smartphone className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">Delete within the app</h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    The quickest and most direct way to delete your Pogo account is inside the application.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-auto">
                    Go to: <span className="font-mono text-sm bg-surface-container-high px-3 py-1.5 rounded-lg mt-3 block text-text-primary border border-card-border">Settings &gt; Delete Account</span>
                  </p>
                </div>

                {/* Email Deletion */}
                <div className="linear-card p-6 md:p-8 rounded-3xl bg-surface-container-low/30 border border-card-border flex flex-col items-start h-full">
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-6 shrink-0">
                    <Mail className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">Request deletion via email</h3>
                  <p className="text-text-secondary leading-relaxed mb-8 flex-1">
                    If you cannot access the app, you can request account deletion by contacting support.
                  </p>
                  <a 
                    href="mailto:support@rhumblabs.com?subject=Pogo%20account%20deletion%20request&body=Please%20delete%20my%20Pogo%20account.%20The%20email%20associated%20with%20my%20Pogo%20account%20is%3A%20"
                    className="linear-button-secondary w-full border border-card-border inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-medium tracking-wide justify-center hover:bg-surface-container-high transition-colors mt-auto"
                  >
                    <Mail className="w-4 h-4" />
                    Email support@rhumblabs.com
                  </a>
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


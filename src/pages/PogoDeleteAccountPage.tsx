import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Mail, ArrowLeft, Trash2, Smartphone, ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function PogoDeleteAccountPage() {
  useEffect(() => {
    document.title = "Pogo Account & Data Deletion Request | RhumbLabs";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Official account and data deletion request page for Pogo app by RhumbLabs. Learn how to delete your account, what data is erased, and data retention policies.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Official account and data deletion request page for Pogo app by RhumbLabs. Learn how to delete your account, what data is erased, and data retention policies.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 pt-32 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link to="/contact" className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors text-sm font-medium mb-10 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Contact
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-[11px] font-bold text-red-400 mb-6 tracking-wide">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Google Play Data Safety & Privacy Policy</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-text-primary">
              Account & Data Deletion for <span className="text-text-secondary">Pogo</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-light max-w-2xl leading-relaxed">
              This page provides step-by-step instructions for users of <strong className="font-semibold text-text-primary">Pogo</strong> (developed by <strong className="font-semibold text-text-primary">RhumbLabs / Rhumb Labs</strong>) to request the deletion of their account and associated personal data.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* How to Delete Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                How to Request Account & Data Deletion
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option 1: In-App */}
                <div className="linear-card p-6 md:p-8 rounded-3xl bg-bg-primary border border-card-border flex flex-col justify-between h-full shadow-[0_10px_30px_var(--shadow-subtle)]">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <Smartphone className="w-6 h-6 text-red-400" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Fastest Method
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary mb-3">Option 1: In-App Deletion</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      You can directly delete your account and all associated data within the Pogo mobile application:
                    </p>

                    <ol className="space-y-3 text-sm text-text-secondary font-light mb-6">
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-card-element text-text-primary font-mono text-xs shrink-0 mt-0.5">1</span>
                        <span>Open the <strong>Pogo</strong> app on your device and log in.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-card-element text-text-primary font-mono text-xs shrink-0 mt-0.5">2</span>
                        <span>Navigate to <strong>Settings</strong> &gt; <strong>Account &amp; Security</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-card-element text-text-primary font-mono text-xs shrink-0 mt-0.5">3</span>
                        <span>Tap <strong className="text-red-400">Delete Account</strong> and confirm your choice.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-xl bg-card-element border border-card-border text-xs text-text-secondary">
                    ⚡ In-app deletion takes effect immediately.
                  </div>
                </div>

                {/* Option 2: Email / Web Form Request */}
                <div className="linear-card p-6 md:p-8 rounded-3xl bg-bg-primary border border-card-border flex flex-col justify-between h-full shadow-[0_10px_30px_var(--shadow-subtle)]">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <Mail className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-card-element text-text-secondary border border-card-border">
                        Web / Support
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary mb-3">Option 2: Email Deletion Request</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      If you no longer have access to the app or cannot log in, send us a web deletion request:
                    </p>

                    <ol className="space-y-3 text-sm text-text-secondary font-light mb-6">
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-card-element text-text-primary font-mono text-xs shrink-0 mt-0.5">1</span>
                        <span>Send an email to <strong className="text-text-primary">support@rhumblabs.com</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-card-element text-text-primary font-mono text-xs shrink-0 mt-0.5">2</span>
                        <span>Use the subject line: <strong className="text-text-primary">"Pogo Account Deletion Request"</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-card-element text-text-primary font-mono text-xs shrink-0 mt-0.5">3</span>
                        <span>Include the email address or username registered with your Pogo account.</span>
                      </li>
                    </ol>
                  </div>

                  <a 
                    href="mailto:support@rhumblabs.com?subject=Pogo%20Account%20Deletion%20Request&body=Hello%20RhumbLabs%20Support%2C%0A%0AI%20would%20like%20to%20request%20the%20permanent%20deletion%20of%20my%20Pogo%20account%20and%20all%20associated%20personal%20data.%0A%0AAccount%20Email%3A%20%0AUser%20Name%20%2F%20ID%3A%20%0A%0AThank%20you."
                    className="linear-button-primary w-full h-12 flex items-center justify-center gap-2 text-sm font-medium rounded-xl"
                  >
                    <Mail className="w-4 h-4" />
                    Submit Deletion Email
                  </a>
                </div>
              </div>
            </section>

            {/* Data Retention & Deletion Policy Details */}
            <section className="linear-card p-8 md:p-10 rounded-3xl bg-bg-primary border border-card-border space-y-8">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-text-primary" />
                <h2 className="text-2xl font-semibold text-text-primary">Data Handling, Erasure &amp; Retention Policy</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {/* Data Deleted */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Types of Data Permanently Deleted
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-light">
                    Upon account deletion, the following data associated with your Pogo account will be permanently deleted from our servers:
                  </p>
                  <ul className="space-y-2 text-sm text-text-secondary font-light pl-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Personal Profile Info:</strong> Name, email address, profile photo, and login credentials.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Activity &amp; Tracking Data:</strong> Climbing logs, session history, attempt counts, and boulder tracking stats.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>User Preferences &amp; Lists:</strong> Saved routes, custom tags, and application settings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Technical Identifiers:</strong> Push notification tokens and active session identifiers.</span>
                    </li>
                  </ul>
                </div>

                {/* Data Retained */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Data Retained &amp; Retention Periods
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-light">
                    In compliance with Google Play Developer policies and applicable laws, certain limited records may be retained as described below:
                  </p>
                  <ul className="space-y-2 text-sm text-text-secondary font-light pl-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span><strong>Financial &amp; Subscription Records:</strong> In-app purchase and subscription billing receipts are retained for up to 7 years to satisfy tax, accounting, and legal requirements.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span><strong>Anonymized Data:</strong> Fully anonymized, aggregated statistics (which cannot identify you) may be kept for app performance analysis.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span><strong>Processing Timeframe:</strong> Email requests are processed within <strong>30 days</strong>. You will receive confirmation when completed.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-card-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary font-light">
                <span>Developer: <strong>RhumbLabs</strong> (Rhumb Labs) • App: <strong>Pogo</strong></span>
                <span>Questions? Contact <a href="mailto:support@rhumblabs.com" className="underline hover:text-text-primary">support@rhumblabs.com</a></span>
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



import { AlertTriangle, Download, Gavel, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll('section, header');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-120px 0px -80% 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary/30 min-h-screen">
      <TopBar onMobileMenuClick={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-surface border-r border-[#424854]/15 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col py-6 px-6 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center h-12">
            <img src="/Logo_RhumbLabs2.png" alt="Rhumb Labs" className="h-full w-auto object-contain scale-[2.5] origin-left -translate-x-10" />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#c8d8f3] hover:text-[#81ecff]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-surface-container-highest rounded-lg">
              <Gavel className="text-primary w-5 h-5" />
            </div>
            <div>
              <div className="text-[#e0e5f4] font-bold text-xs uppercase tracking-widest font-['Inter']">Legal Pack</div>
              <div className="text-primary text-[10px] font-medium uppercase tracking-tighter">v2026.04.10</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 font-['Inter'] text-[11px] uppercase tracking-[0.15em] overflow-y-auto flex-1">
          <a href="#intro" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'intro' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Introduction</a>
          <a href="#privacy" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'privacy' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Privacy Policy</a>
          <a href="#terms" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'terms' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Terms of Use</a>
          <a href="#billing" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'billing' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Billing & Refund</a>
          <a href="#aviation" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'aviation' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Aviation Disclaimer</a>
          <a href="#open-source" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'open-source' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Open Source</a>
        </nav>

        <div className="mt-auto flex flex-col gap-4 pt-8 border-t border-[#424854]/15">
          <button className="bg-[#1e2635] text-[#81ecff] py-3 px-4 rounded-lg flex items-center justify-between group transition-all hover:bg-primary/10">
            <span className="text-[10px] font-bold uppercase tracking-widest">Download Full Pack</span>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="pt-24 min-h-screen max-w-[1440px] mx-auto flex flex-col md:flex-row relative">
        {/* SideNavBar */}
        <aside className="hidden md:flex h-screen sticky top-20 w-80 flex-col gap-6 py-12 px-8 border-r border-[#424854]/15 bg-surface">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-surface-container-highest rounded-lg">
                <Gavel className="text-primary w-5 h-5" />
              </div>
              <div>
                <div className="text-[#e0e5f4] font-bold text-xs uppercase tracking-widest font-['Inter']">Legal Pack</div>
                <div className="text-primary text-[10px] font-medium uppercase tracking-tighter">v2026.04.10</div>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1 font-['Inter'] text-[11px] uppercase tracking-[0.15em]">
            <a href="#intro" className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'intro' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Introduction</a>
            <a href="#privacy" className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'privacy' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Privacy Policy</a>
            <a href="#terms" className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'terms' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Terms of Use</a>
            <a href="#billing" className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'billing' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Billing & Refund</a>
            <a href="#aviation" className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'aviation' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Aviation Disclaimer</a>
            <a href="#open-source" className={`py-3 px-4 transition-all border-l-2 ${activeSection === 'open-source' ? 'text-[#81ecff] font-bold border-[#81ecff] bg-primary/5' : 'text-[#c8d8f3]/60 hover:text-primary hover:bg-surface-container-low border-transparent'}`}>Open Source</a>
          </nav>
          <div className="mt-auto flex flex-col gap-4 pt-8 border-t border-[#424854]/15">
            <button className="bg-[#1e2635] text-[#81ecff] py-3 px-4 rounded-lg flex items-center justify-between group transition-all hover:bg-primary/10">
              <span className="text-[10px] font-bold uppercase tracking-widest">Download Full Pack</span>
              <Download className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Content Canvas */}
        <div className="flex-1 px-8 md:px-24 py-16 relative">
          <header id="intro" className="mb-24">
            <div className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-6 flex items-center gap-4">
              <div className="h-px w-8 bg-primary"></div>
              Integrity Framework & Governance
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-10 leading-[0.9]">Legal <br /><span className="text-primary">Standards.</span></h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 border-t border-outline-variant/10 pt-12">
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Important Note</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed italic">
                  The following documentation constitutes the complete RhumbNav Legal Pack. These documents are legally binding for all users of the RhumbNav software suite and Rhumb Labs services. By accessing or using our platform, you acknowledge that you have read, understood, and agreed to these terms in their entirety.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Implementation Reminders</h3>
                <ul className="text-sm text-on-surface-variant space-y-3 list-none">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">01</span>
                    <span>All documents below are effective as of April 10, 2026.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">02</span>
                    <span>Prior versions are archived and available upon request via the Legal Center.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">03</span>
                    <span>Compliance updates are pushed quarterly via the RhumbNav Core updates.</span>
                  </li>
                </ul>
              </div>
            </div>
          </header>

          <div className="space-y-40 legal-text">
            {/* 1. RhumbNav Privacy Policy */}
            <section id="privacy">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">RhumbNav Privacy Policy</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="max-w-3xl">
                <h3>1. Data Sovereignty</h3>
                <p>Rhumb Labs prioritizes data sovereignty. Our governance protocols ensure that all telemetry and architectural data processed through our systems is encrypted at rest and in transit using military-grade AES-256 protocols. We treat your data as your intellectual property, ensuring that the primary user maintains absolute control over access permissions.</p>
                <h3>2. Telemetry and Collection</h3>
                <p>We strictly adhere to the principle of least privilege. Data collection is limited to essential operational parameters required for structural analysis, platform optimization, and critical safety reporting. This includes system performance metrics, error logs, and situational metadata.</p>
                <h3>3. Information Sharing</h3>
                <p>We do not sell, trade, or monetize user data. Your digital footprint within the Rhumb ecosystem remains strictly confidential, accessible only to authorized personnel under rigorous audit logging. Third-party disclosure only occurs under legal compulsion or for essential integrated service functionality explicitly approved by the user.</p>
              </div>
            </section>

            {/* 2. RhumbNav Terms of Use */}
            <section id="terms">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">RhumbNav Terms of Use</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="max-w-3xl">
                <h3>1. License Grant</h3>
                <p>Subject to compliance with these terms, Rhumb Labs grants a non-exclusive, non-transferable, revocable license to use the RhumbNav suite. This license is tied to a specific organizational ID and cannot be shared across multiple entities without explicit written consent.</p>
                <h3>2. Platform Integrity</h3>
                <p>Users must maintain the security of their Rhumb Core credentials. Any unauthorized access resulting from credential leakage is the responsibility of the primary license holder. Automated scraping, reverse engineering, or stress-testing of Rhumb Labs' neural architecture is strictly prohibited.</p>
                <h3>3. Liability Limitations</h3>
                <p>Rhumb Labs provides its services "as is" and "as available." To the maximum extent permitted by law, Rhumb Labs shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the software services.</p>
              </div>
            </section>

            {/* 3. RhumbNav Subscription and Refund Policy */}
            <section id="billing">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">RhumbNav Subscription & Refund Policy</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="max-w-3xl">
                <h3>1. Precision Billing Model</h3>
                <p>Rhumb Labs operates on a 'Precision Usage' model. Subscriptions are billed monthly in advance based on the selected tier. Overage charges for high-frequency telemetry are calculated at the end of each billing cycle and applied to the subsequent invoice.</p>
                <h3>2. Cancellation and Termination</h3>
                <p>Users may cancel their subscription at any time via the billing portal. Cancellations take effect at the end of the current billing cycle. Access to the platform remains active until the end of the paid period, after which data enters a 90-day grace period before permanent deletion.</p>
                <h3>3. Refund Provisions</h3>
                <p>Refunds are typically not issued for partial month usage. Exceptions are made for technical service outages exceeding 99.5% Service Level Agreement (SLA) uptime, or where required by regional consumer protection laws. Processing of approved refunds takes 5-7 business days.</p>
              </div>
            </section>

            {/* 4. RhumbNav Aviation Disclaimer */}
            <section id="aviation">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">RhumbNav Aviation Disclaimer</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="bg-error/5 border border-error/20 p-12 rounded-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <AlertTriangle className="text-error w-8 h-8" />
                  <h3 className="!m-0 text-error font-black">CRITICAL NOTICE FOR ALL OPERATORS</h3>
                </div>
                <div className="space-y-6 text-on-surface leading-relaxed">
                  <p><strong>RhumbNav™ is NOT for primary navigation.</strong> The software provided by Rhumb Labs is intended for situational awareness and structural modeling only.</p>
                  <p>Under no circumstances should these tools be used as the sole source of navigation for commercial or private flight operations. All flight crews must rely on certified onboard instrumentation and approved aeronautical charts for flight-path decision making.</p>
                  <p>Rhumb Labs assumes no liability for incidents, accidents, or regulatory violations arising from the misuse of this situational awareness tool in critical flight-path operations.</p>
                </div>
              </div>
            </section>

            {/* 5. RhumbNav Open Source and Third-Party Notices */}
            <section id="open-source" className="pb-32">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">RhumbNav Open Source & Third-Party Notices</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Effective April 10, 2026</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-surface-container-high rounded-xl border border-outline-variant/10">
                  <h4>Carto-Logic Engine</h4>
                  <p className="text-xs">Licensed under the Apache License, Version 2.0. Portions of this software utilize components from the OpenStreetMap Project and GEOS library.</p>
                </div>
                <div className="p-8 bg-surface-container-high rounded-xl border border-outline-variant/10">
                  <h4>RhumbView UI</h4>
                  <p className="text-xs">Proprietary elements inspired by Tailwind CSS (MIT License). All structural patterns and architectural visualization shaders developed in-house.</p>
                </div>
                <div className="p-8 bg-surface-container-high rounded-xl border border-outline-variant/10">
                  <h4>Postgres Dynamics</h4>
                  <p className="text-xs">Utilizes customized PostgreSQL instances for immutable ledgering. Portions (c) 1996-2026 The PostgreSQL Global Development Group.</p>
                </div>
                <div className="p-8 bg-surface-container-high rounded-xl border border-outline-variant/10">
                  <h4>Security Headers</h4>
                  <p className="text-xs">Encryption protocols leverage OpenSSL libraries (OpenSSL License). Standard compliance: FIPS 140-2.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

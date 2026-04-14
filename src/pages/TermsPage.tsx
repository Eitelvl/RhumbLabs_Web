import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary/30 min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 pt-32 pb-24 px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-12">Terms of <span className="text-primary">Service.</span></h1>
        
        <div className="space-y-8 text-on-surface-variant font-manrope">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-8">Last updated: April 2026</p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using this website, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you should not use the website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">2. Nature of the Website</h2>
            <p className="mb-4">This website is provided for informational purposes and serves as a presentation of Rhumb Labs, its projects, and its products or services.</p>
            <p className="mb-4">The website may also offer a contact channel for general inquiries, support requests, feedback, suggestions, or business communications.</p>
            <p>The website does not currently provide user accounts, paid subscriptions, or direct commercial transactions through the website itself unless expressly stated otherwise.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">3. Permitted Use</h2>
            <p className="mb-4">You agree to use the website only for lawful purposes and in a manner that does not violate applicable laws, third-party rights, or these Terms.</p>
            <p className="mb-4">You must not:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>submit unlawful, abusive, defamatory, fraudulent, infringing, misleading, or harmful content through the website or its contact channels;</li>
              <li>attempt to disrupt, damage, or interfere with the operation or security of the website;</li>
              <li>use the website to distribute spam, malware, or unauthorized promotional content;</li>
              <li>impersonate any person or entity or misrepresent your affiliation with any person or organization.</li>
            </ul>
            <p>You are responsible for any information you choose to submit through the website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">4. Intellectual Property</h2>
            <p className="mb-4">All content available on this website, including but not limited to text, branding, names, logos, design elements, layouts, graphics, visual assets, and original written content, is the property of Rhumb Labs or is used with appropriate permission, unless otherwise stated.</p>
            <p>No part of the website may be copied, reproduced, distributed, modified, published, or used for commercial purposes without prior written permission from Rhumb Labs.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">5. No Professional or Operational Reliance</h2>
            <p className="mb-4">Any information made available on this website, including technical, software, aviation-related, or business-related information, is provided for general informational purposes only.</p>
            <p>It does not constitute operational, legal, financial, regulatory, or professional advice, and should not replace official documentation, certified data sources, or professional judgment where applicable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">6. Disclaimer of Warranties</h2>
            <p className="mb-4">This website is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.</p>
            <p className="mb-4">Rhumb Labs does not guarantee that:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>the website will always be available,</li>
              <li>the website will be free of errors, interruptions, or vulnerabilities,</li>
              <li>the content will always be complete, accurate, or up to date,</li>
              <li>every message or inquiry submitted through the website will receive a response.</li>
            </ul>
            <p>Use of the website is at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">7. Limitation of Liability</h2>
            <p className="mb-4">To the fullest extent permitted by applicable law, Rhumb Labs shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising out of or related to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>access to or use of the website,</li>
              <li>inability to access or use the website,</li>
              <li>reliance on website content,</li>
              <li>communications sent through the website,</li>
              <li>interruptions, technical failures, or unauthorized access.</li>
            </ul>
            <p>Nothing in these Terms excludes liability where such exclusion is not permitted by applicable law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">8. Third-Party Links</h2>
            <p className="mb-4">This website may contain links to third-party websites, services, or resources for convenience or reference.</p>
            <p>Rhumb Labs does not control and is not responsible for the content, availability, accuracy, policies, or practices of any third-party websites or services. Accessing third-party links is at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">9. Future Products and Services</h2>
            <p className="mb-4">Applications, platforms, or services developed or published by Rhumb Labs may be subject to their own separate terms of use, privacy policies, disclaimers, licensing terms, or subscription conditions.</p>
            <p>These Terms apply only to the website unless otherwise expressly stated.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">10. Website Changes</h2>
            <p className="mb-4">Rhumb Labs reserves the right to modify, suspend, restrict, or discontinue any part of the website, as well as to update these Terms, at any time and without prior notice.</p>
            <p>Continued use of the website after changes are posted may constitute acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">11. Age Requirement</h2>
            <p>This website is not intended for use by children without the involvement or authorization of a parent or legal guardian.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">12. Governing Law</h2>
            <p>These Terms shall be governed by and interpreted in accordance with the laws of Chile, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">13. Contact</h2>
            <p className="mb-4">For questions regarding these Terms of Service, please contact:</p>
            <p><a href="mailto:support@rhumblabs.com" className="text-primary hover:underline">support@rhumblabs.com</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

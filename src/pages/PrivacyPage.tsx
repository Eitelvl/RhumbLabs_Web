import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="bg-bg-primary text-text-primary selection:bg-card-border min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 pt-32 pb-24 px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-5xl md:text-[5.5rem] font-medium tracking-tight mb-16 leading-[0.9] text-text-primary">Privacy <span className="text-text-secondary">Policy.</span></h1>
        
        <div className="space-y-8 text-text-secondary font-light">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-12">Last updated: April 2026</p>
          </div>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">1. Introduction</h2>
            <p className="mb-4">Rhumb Labs is a software development company. This Privacy Policy explains how personal information is collected, used, and protected when you visit our website or contact us through our contact form, email, or other communication channels available on the website.</p>
            <p>This Privacy Policy applies only to the Rhumb Labs website. Any applications, products, or services developed by Rhumb Labs may be subject to their own separate privacy policies depending on their functionality.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">2. Information We Collect</h2>
            <p className="mb-4">We may collect personal information that you voluntarily provide when you contact us through the website. This may include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Message content</li>
              <li>Any other information you choose to include in your communication</li>
            </ul>
            <p className="mb-4">We may also automatically collect limited technical information necessary for the operation, security, and performance of the website, such as:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Device information</li>
              <li>Date and time of access</li>
              <li>Referring page or general access logs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">3. How We Use Information</h2>
            <p className="mb-4">We use the information collected only for legitimate website and communication-related purposes, including:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Responding to inquiries</li>
              <li>Providing support</li>
              <li>Reviewing feedback, suggestions, or business requests</li>
              <li>Maintaining website security and preventing abuse</li>
              <li>Improving the operation and reliability of the website and contact channels</li>
            </ul>
            <p>We do not sell, rent, or trade personal information. We do not use personal information submitted through the website for advertising or marketing purposes unless the user has separately and clearly requested or agreed to that purpose.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">4. Contact Form Communications</h2>
            <p className="mb-4">If you submit a message through the website, the information you provide will be used solely to review, manage, and respond to your inquiry.</p>
            <p>Please do not submit sensitive personal information, confidential data, payment information, or third-party personal data through the contact form unless it is strictly necessary and you are authorized to share it.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">5. Legal Basis and User Choice</h2>
            <p className="mb-4">By voluntarily submitting information through the website's contact channels, you acknowledge that Rhumb Labs may process that information for the purpose of responding to your request, managing communications, and maintaining reasonable internal records related to that communication.</p>
            <p>Providing personal information through the contact form is optional, but certain information may be necessary for us to respond properly.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">6. Data Retention</h2>
            <p className="mb-4">We retain personal information only for as long as reasonably necessary to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>respond to your inquiry,</li>
              <li>provide follow-up support or communication,</li>
              <li>maintain basic internal records,</li>
              <li>comply with legal or operational obligations.</li>
            </ul>
            <p>After that, the information may be securely deleted or anonymized when appropriate.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">7. Cookies and Similar Technologies</h2>
            <p className="mb-4">This website may use essential cookies or similar technical mechanisms required for basic functionality, security, performance, or session management.</p>
            <p className="mb-4">We do not use cookies for behavioral advertising or user profiling through the website.</p>
            <p>You may disable cookies through your browser settings, although some website functions may not work as intended.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">8. Third-Party Services</h2>
            <p className="mb-4">We may use third-party technical service providers to operate the website or support communications, such as hosting providers, email services, security tools, spam prevention tools, or website infrastructure services.</p>
            <p className="mb-4">Where applicable, those providers may process limited personal information strictly for the technical purpose of operating or securing the website and related communications.</p>
            <p>External websites and services linked from this website, including app stores, aviation authorities, or other third-party resources, are governed by their own privacy policies and data practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">9. Data Security</h2>
            <p className="mb-4">We take reasonable administrative, technical, and organizational measures to help protect personal information against unauthorized access, misuse, loss, alteration, or disclosure.</p>
            <p>However, no website, transmission method, or electronic storage system can be guaranteed to be completely secure. Use of the website and submission of information is at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">10. International Processing</h2>
            <p className="mb-4">Depending on the technical infrastructure used to host the website or process contact requests, personal information may be processed or stored in countries other than your own.</p>
            <p>Where this occurs, Rhumb Labs will seek to handle such information in a manner consistent with applicable legal requirements and reasonable data protection standards.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">11. Your Rights</h2>
            <p className="mb-4">You may contact us to request reasonable access to, correction of, or deletion of your personal information, subject to applicable legal and operational limitations.</p>
            <p>You may also contact us if you have questions about how your information is handled through the website.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">12. Children</h2>
            <p className="mb-4">This website is not directed to children and is not intended to knowingly collect personal information from minors without appropriate authorization from a parent or legal guardian.</p>
            <p>If you believe that personal information from a minor has been submitted through the website without proper authorization, please contact us so that we can review and, where appropriate, delete that information.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">13. Changes to This Privacy Policy</h2>
            <p className="mb-4">Rhumb Labs may update this Privacy Policy from time to time to reflect changes in the website, operations, or legal requirements.</p>
            <p>Any updates will be posted on this page with a revised "Last updated" date.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">14. Contact</h2>
            <p className="mb-4">For questions or requests related to this Privacy Policy, please contact:</p>
            <p><a href="mailto:support@rhumblabs.com" className="text-primary hover:underline">support@rhumblabs.com</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

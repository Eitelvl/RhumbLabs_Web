/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LegalPage from './pages/LegalPage';
import LegalDocPage from './pages/LegalDocPage';
import ContactPage from './pages/ContactPage';
import RhumbNavPage from './pages/RhumbNavPage';
import PogoPage from './pages/PogoPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/legal/*" element={<LegalDocPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/rhumbnav" element={<RhumbNavPage />} />
        <Route path="/pogo" element={<PogoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

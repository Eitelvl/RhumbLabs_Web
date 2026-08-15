/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LegalPage from './pages/LegalPage';
import LegalDocPage from './pages/LegalDocPage';
import ContactPage from './pages/ContactPage';
import ProductsPage from './pages/ProductsPage';
import RhumbNavPage from './pages/RhumbNavPage';
import PogoPage from './pages/PogoPage';
import PogoDeleteAccountPage from './pages/PogoDeleteAccountPage';
import RhumbNavDeleteAccountPage from './pages/RhumbNavDeleteAccountPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ScrollToTop from './components/ScrollToTop';
import { BrandThemeProvider } from './context/BrandThemeContext';
import { BrandSmokeCanvas } from './components/BrandSmokeCanvas';

export default function App() {
  const basename = import.meta.env.BASE_URL || '/';

  return (
    <BrandThemeProvider>
      <BrowserRouter basename={basename === '/' ? undefined : basename}>
        <ScrollToTop />
        <BrandSmokeCanvas />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/legal/*" element={<LegalDocPage />} />
          <Route path="/static-legal/*" element={<LegalDocPage />} />
          <Route path="/pogo/privacy" element={<LegalDocPage />} />
          <Route path="/pogo/privacy-policy" element={<LegalDocPage />} />
          <Route path="/pogo/terms" element={<LegalDocPage />} />
          <Route path="/pogo/terms-of-use" element={<LegalDocPage />} />
          <Route path="/rhumbnav/privacy" element={<LegalDocPage />} />
          <Route path="/rhumbnav/privacy-policy" element={<LegalDocPage />} />
          <Route path="/rhumbnav/terms" element={<LegalDocPage />} />
          <Route path="/rhumbnav/terms-of-use" element={<LegalDocPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<ContactPage />} />
          <Route path="/rhumbnav" element={<RhumbNavPage />} />
          <Route path="/rhumbnav/delete-account" element={<RhumbNavDeleteAccountPage />} />
          <Route path="/rhumbnav-delete-account" element={<RhumbNavDeleteAccountPage />} />
          <Route path="/pogo" element={<PogoPage />} />
          <Route path="/pogo/delete-account" element={<PogoDeleteAccountPage />} />
          <Route path="/pogo-delete-account" element={<PogoDeleteAccountPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage />} />
          <Route path="/data-deletion" element={<DeleteAccountPage />} />
        </Routes>
      </BrowserRouter>
    </BrandThemeProvider>
  );
}

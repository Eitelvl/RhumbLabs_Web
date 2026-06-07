const fs = require('fs');

const singleTexts = [
  "Have a question or want to work with us? We'd love to hear from you.",
  "Name",
  "Email",
  "Message",
  "Send Message"
];

let cp = fs.readFileSync('src/pages/ContactPage.tsx', 'utf8');
if (!cp.includes('useLanguage')) {
  cp = cp.replace(/import React(.*) from 'react';/, "import React$1 from 'react';\\nimport { useLanguage } from '../contexts/LanguageContext';");
  cp = cp.replace(/export default function ContactPage\(\) {/, "export default function ContactPage() {\\n  const { t } = useLanguage();");
  cp = cp.replace(/<h1(.*?)>Get in touch<\/h1>/, "<h1$1>{t('Get in touch')}</h1>");
  singleTexts.forEach(s => {
    cp = cp.split('>' + s).join('>{t("' + s.replace(/"/g, '\\\\"') + '")}');
    // Also handle placeholder texts
    cp = cp.split('placeholder="' + s + '"').join('placeholder={t("' + s.replace(/"/g, '\\\\"') + '")}');
    // Labels
    cp = cp.replace(new RegExp(`>\\s*${s.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&')}\\s*<`), `>{t("${s}")}<`);
  });
  // Handle Contact specific ones
  cp = cp.replace("Get in touch", "{t('Get in touch')}"); // Inside h1 maybe
  
  fs.writeFileSync('src/pages/ContactPage.tsx', cp);
}

// ----------------

const footerTexts = [
  "About Us",
  "Contact",
  "Products",
  "Legal",
  "Privacy Policy",
  "Terms of Service"
];

let fp = fs.readFileSync('src/components/Footer.tsx', 'utf8');
if (!fp.includes('useLanguage')) {
  fp = fp.replace("import { Link", "import { useLanguage } from '../contexts/LanguageContext';\\nimport { Link");
  fp = fp.replace("export default function Footer() {", "export default function Footer() {\\n  const { t } = useLanguage();");
  
  footerTexts.forEach(s => {
    fp = fp.replace(new RegExp(`>\\s*${s}\\s*<`), `>{t("${s}")}<`);
    fp = fp.replace(new RegExp(`>\\s*${s}\\s*</`), `>{t("${s}")}</`);
  });
  
  fp = fp.replace("All rights reserved.", "{t('All rights reserved.')}");
  
  fs.writeFileSync('src/components/Footer.tsx', fp);
}
console.log('done 4');

const fs = require('fs');

const tp = fs.readFileSync('src/pages/LegalPage.tsx', 'utf8');

if (!tp.includes('useLanguage')) {
  let content = tp.replace(/import React(.*) from 'react';/, "import React$1 from 'react';\\nimport { useLanguage } from '../contexts/LanguageContext';");
  content = content.replace(/export default function LegalPage\(\) {/, "export default function LegalPage() {\\n  const { t } = useLanguage();");
  
  const toTranslate = [
    "Legal Center",
    "Find legal documents, privacy policies, terms, disclaimers, and notices for Rhumb Labs and its products.",
    "Company Legal",
    "Company Privacy",
    "Privacy Policy",
    "Terms of Use",
    "Subscription & Refund Policy",
    "Aviation Disclaimer",
    "Third Party Notices"
  ];
  
  toTranslate.forEach(s => {
    content = content.split('>' + s).join('>{t("' + s.replace(/"/g, '\\\\"') + '")}');
    content = content.split('"' + s + '"').join('{t("' + s.replace(/"/g, '\\\\"') + '")}');
  });

  fs.writeFileSync('src/pages/LegalPage.tsx', content);
}

let dp = fs.readFileSync('src/pages/LegalDocPage.tsx', 'utf8');

if (!dp.includes('useLanguage')) {
  let content = dp.replace(/import React(.*) from 'react';/, "import React$1 from 'react';\\nimport { useLanguage } from '../contexts/LanguageContext';");
  content = content.replace(/export default function LegalDocPage\(\) {/, "export default function LegalDocPage() {\\n  const { t } = useLanguage();");
  
  const toTranslate = [
    "Back to Legal Center",
    "Legal Center",
    "Return to Legal Overview",
    "Document not found"
  ];
  
  toTranslate.forEach(s => {
    content = content.split('>' + s).join('>{t("' + s.replace(/"/g, '\\\\"') + '")}');
    content = content.split('"' + s + '"').join('{t("' + s.replace(/"/g, '\\\\"') + '")}');
  });

  fs.writeFileSync('src/pages/LegalDocPage.tsx', content);
}
console.log('done 5');

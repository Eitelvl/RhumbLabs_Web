const fs = require('fs');

const rhumbDict = {
  "Flight simplified. <br className=\"hidden md:block\"/> Navigation perfected.": "Flight simplified.",  // "Vuelo simplificado. <br/> Navegación perfeccionada."
  "RhumbNav is a new light EFB shaped by real flight experience, bringing flight planning, navigation, and in-flight awareness into one seamless experience.": "RhumbNav is a new light EFB shaped by real flight experience, bringing flight planning, navigation, and in-flight awareness into one seamless experience.",
  "Coming Soon for Android": "Coming Soon for Android",
  "Precision calculation": "Precision calculation",
  "Flight calculations made faster, cleaner, and easier. From wind correction to fuel planning, RhumbNav gives you the numbers that matter—without the clutter.": "Flight calculations made faster, cleaner, and easier. From wind correction to fuel planning, RhumbNav gives you the numbers that matter—without the clutter.",
  "Logbook & Credentials": "Logbook & Credentials",
  "Your entire flight history and pilot credentials, securely stored, instantly searchable, and beautifully presented in one unified digital logbook.": "Your entire flight history and pilot credentials, securely stored, instantly searchable, and beautifully presented in one unified digital logbook.",
  "Confident flying": "Confident flying",
  "Every detail you need to execute a safe flight.": "Every detail you need to execute a safe flight.",
  "Comprehensive planning": "Comprehensive planning",
  "From departure to destination.": "From departure to destination."
};

let rn = fs.readFileSync('src/pages/RhumbNavPage.tsx', 'utf8');

if (!rn.includes('useLanguage')) {
  rn = rn.replace(/import { motion/, "import { useLanguage } from '../contexts/LanguageContext';\\nimport { motion");
  rn = rn.replace(/export default function RhumbNavPage\(\) {/, "export default function RhumbNavPage() {\\n  const { t } = useLanguage();");

  rn = rn.replace(/>Flight simplified. <br className="hidden md:block"\/> Navigation perfected.</, ">{t('Flight simplified.')} <br className=\"hidden md:block\"/> {t('Navigation perfected.')}<");

  const singles = [
    "RhumbNav is a new light EFB shaped by real flight experience, bringing flight planning, navigation, and in-flight awareness into one seamless experience.",
    "Coming Soon for Android",
    "Precision calculation",
    "Flight calculations made faster, cleaner, and easier. From wind correction to fuel planning, RhumbNav gives you the numbers that matter—without the clutter.",
    "Logbook & Credentials",
    "Your entire flight history and pilot credentials, securely stored, instantly searchable, and beautifully presented in one unified digital logbook.",
    "Confident flying",
    "Every detail you need to execute a safe flight.",
    "Comprehensive planning",
    "From departure to destination."
  ];

  singles.forEach(s => {
      rn = rn.split('>' + s).join('>{t("' + s.replace(/"/g, '\\\\"') + '")}');
      rn = rn.split('"' + s + '"').join('{t("' + s.replace(/"/g, '\\\\"') + '")}');
  });

  fs.writeFileSync('src/pages/RhumbNavPage.tsx', rn);
}

console.log('done rhumb');

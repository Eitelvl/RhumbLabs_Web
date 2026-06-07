const fs = require('fs');

const pogoDict = {
  "Master every route. <br className=\"hidden md:block\"/> Elevate your climb.": "Master every route.",
  "Designed exclusively for the climbing community. Log your sessions, analyze your progress, and stay motivated with a digital companion built for the wall.": "Designed exclusively for the climbing community. Log your sessions, analyze your progress, and stay motivated with a digital companion built for the wall.",
  "Log every session": "Log every session",
  "Log your bouldering sessions, attempts, completed problems, grades, climbing time, and personal notes. Pogo keeps your history organized to make your progression tangible.": "Log your bouldering sessions, attempts, completed problems, grades, climbing time, and personal notes. Pogo keeps your history organized to make your progression tangible.",
  "See your progress": "See your progress",
  "Visualize your growth across multiple gyms. View completed ascents and push harder by tracking color grades systematically across various locations.": "Visualize your growth across multiple gyms. View completed ascents and push harder by tracking color grades systematically across various locations.",
  "Visual Gym Grading": "Visual Gym Grading",
  "Select your gym and let Pogo map its unique grading system.": "Select your gym and let Pogo map its unique grading system.",
  "Clear Progression": "Clear Progression",
  "Your Gym\\'s Grades": "Your Gym\\'s Grades"
};

let pp = fs.readFileSync('src/pages/PogoPage.tsx', 'utf8');

if (!pp.includes('useLanguage')) {
  pp = pp.replace(/import { motion/, "import { useLanguage } from '../contexts/LanguageContext';\\nimport { motion");
  pp = pp.replace(/export default function PogoPage\(\) {/, "export default function PogoPage() {\n  const { t } = useLanguage();");

  pp = pp.replace(/>Master every route. <br className="hidden md:block"\/> Elevate your climb.</, ">{t('Master every route.')} <br className=\"hidden md:block\"/> {t('Elevate your climb.')}<");
  
  const singles = [
    "Designed exclusively for the climbing community. Log your sessions, analyze your progress, and stay motivated with a digital companion built for the wall.",
    "Coming Soon for Android",
    "Log every session",
    "Log your bouldering sessions, attempts, completed problems, grades, climbing time, and personal notes. Pogo keeps your history organized to make your progression tangible.",
    "See your progress",
    "Visualize your growth across multiple gyms. View completed ascents and push harder by tracking color grades systematically across various locations.",
    "Visual Gym Grading",
    "Select your gym and let Pogo map its unique grading system."
  ];

  singles.forEach(s => {
      pp = pp.split('>' + s).join('>{t("' + s.replace(/"/g, '\\\\"') + '")}');
      pp = pp.split('"' + s + '"').join('{t("' + s.replace(/"/g, '\\\\"') + '")}');
  });

  fs.writeFileSync('src/pages/PogoPage.tsx', pp);
}

console.log('done pogo');

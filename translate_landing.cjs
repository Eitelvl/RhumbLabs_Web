const fs = require('fs');

let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');
if (!lp.includes('useLanguage')) {
  lp = lp.replace(/import React(.*) from 'react';/, "import React$1 from 'react';\nimport { useLanguage } from '../contexts/LanguageContext';");
  lp = lp.replace(/export default function LandingPage\(\) {/, "export default function LandingPage() {\n  const { t } = useLanguage();");

  lp = lp.replace("Building the next generation of software", "{t('Building the next generation of software')}");
  lp = lp.replace(/Digital products <br className="hidden md:block" \/>/g, "{t('Digital products')} <br className=\"hidden md:block\" />");
  lp = lp.replace("built with purpose.", "{t('built with purpose.')}");
  lp = lp.replace("We focus on creating reliable, intuitive, and beautifully crafted software.", "{t('We focus on creating reliable, intuitive, and beautifully crafted software.')}");
  lp = lp.replace("Our Products\\n               <ArrowRight", "{t('Our Products')}\\n               <ArrowRight");
  lp = lp.replace("Aviation navigation,", "{t('Aviation navigation,')}");
  lp = lp.replace(">reimagined.<", ">{t('reimagined.')}<");
  lp = lp.replace("RhumbNav brings complete flight planning and navigation to your mobile device, reducing workload and increasing situation awareness for pilots of all levels.", "{t('RhumbNav brings complete flight planning and navigation to your mobile device, reducing workload and increasing situation awareness for pilots of all levels.')}");
  lp = lp.replace("Climb higher,", "{t('Climb higher,')}");
  lp = lp.replace(">track smarter.<", ">{t('track smarter.')}<");
  lp = lp.replace("Log your bouldering sessions, visualize your progress over time, and stay motivated. Built specifically for the climbing community.", "{t('Log your bouldering sessions, visualize your progress over time, and stay motivated. Built specifically for the climbing community.')}");
  lp = lp.replace(">About Us<", ">{t('About Us')}<");
  lp = lp.replace(">Independent and driven<", ">{t('Independent and driven')}<");
  lp = lp.replace("We build the products we want to see in the world. As an independent studio, we have the freedom to focus purely on product quality, user experience, and solving real problems without compromise.", "{t('We build the products we want to see in the world. As an independent studio, we have the freedom to focus purely on product quality, user experience, and solving real problems without compromise.')}");
  lp = lp.replace("Our approach is simple: understand the core user needs, strip away the unnecessary, and build rock-solid software that people rely on.", "{t('Our approach is simple: understand the core user needs, strip away the unnecessary, and build rock-solid software that people rely on.')}");
  lp = lp.replace(">Explore RhumbNav", ">{t('Explore RhumbNav')}");
  lp = lp.replace(">Explore Pogo", ">{t('Explore Pogo')}");
  
  // also handle "Our Products" since \n regex might fail
  lp = lp.replace(">\\n               Our Products\\n               <ArrowRight", ">\\n               {t('Our Products')}\\n               <ArrowRight");
  
  fs.writeFileSync('src/pages/LandingPage.tsx', lp);
}
console.log('Done landing page');

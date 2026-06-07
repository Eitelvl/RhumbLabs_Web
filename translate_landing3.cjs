const fs = require('fs');

let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');

lp = lp.replace("Explore Pogo\\n                    <ArrowRight", "{t('Explore Pogo')}\\n                    <ArrowRight");
lp = lp.replace(/>\\s*Crafting Software <br className="hidden md:block"\/>\\s*with intention.\\s*</, ">{t('Crafting Software')} <br className=\"hidden md:block\"/> {t('with intention.')}<");
lp = lp.replace("We care deeply about clarity, functionality, and creating tools that feel intuitive from the very first tap. By bringing together design and robust engineering, we shape digital products that are simple, reliable, and built with purpose.", "{t('We care deeply about clarity, functionality, and creating tools that feel intuitive from the very first tap. By bringing together design and robust engineering, we shape digital products that are simple, reliable, and built with purpose.')}");
lp = lp.replace("Get in touch\\n            </Link>", "{t('Get in touch')}\\n            </Link>");

// Replace array maps!
lp = lp.replace(/\{\['Complete VFR Navigation', 'Digital Logbook & Pilot Credentials', 'Real-time Weather & Airport Info', 'Advanced E6B Flight Computer'\].map\(feature => \(/, "{[t('Complete VFR Navigation'), t('Digital Logbook & Pilot Credentials'), t('Real-time Weather & Airport Info'), t('Advanced E6B Flight Computer')].map(feature => (");

lp = lp.replace(/\{\['Track Grades', 'Performance Analytics', 'Gym-Based Grades', 'Session Logging'\].map\(feature => \(/, "{[t('Track Grades'), t('Performance Analytics'), t('Gym-Based Grades'), t('Session Logging')].map(feature => (");

fs.writeFileSync('src/pages/LandingPage.tsx', lp);
console.log('done 3');

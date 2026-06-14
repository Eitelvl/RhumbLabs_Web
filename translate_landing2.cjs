const fs = require('fs');

const extraDict = {
  'Aviation precision <br className="hidden xl:block"/>in your pocket.': "Aviation precision", // I'll handle manually
  "Complete VFR Navigation": "Complete VFR Navigation",
  "Digital Logbook & Pilot Credentials": "Digital Logbook & Pilot Credentials",
  "Real-time Weather & Airport Info": "Real-time Weather & Airport Info",
  "Advanced E6B Flight Computer": "Advanced E6B Flight Computer",
  "Discover RhumbNav": "Discover RhumbNav",
  'Log, track, and master <br className="hidden xl:block"/>your climbs.': "Log, track, and master",
  "Log climbs with custom gym color-grading systems.": "Log climbs with custom gym color-grading systems.",
  "Deep analytics on your bouldering performance.": "Deep analytics on your bouldering performance.",
  "Track progression across multiple gyms.": "Track progression across multiple gyms.",
  "Community-driven session logging.": "Community-driven session logging.",
  "Discover Pogo": "Discover Pogo",
  "About": "About",
  "Our approach is simple:": "Our approach is simple:"
};

let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');

lp = lp.replace(/>Aviation precision <br className="hidden xl:block"\/>in your pocket.</g, ">{t('Aviation precision')} <br className=\"hidden xl:block\"/>{t('in your pocket.')}<");

lp = lp.replace(/>Log, track, and master <br className="hidden xl:block"\/>your climbs.</g, ">{t('Log, track, and master')} <br className=\"hidden xl:block\"/>{t('your climbs.')}<");

const singles = [
  "The all-in-one flight planning, navigation, and logbook platform designed exclusively for modern pilots. Beautifully complex, incredibly simple to use.",
  "Complete VFR Navigation",
  "Digital Logbook & Pilot Credentials",
  "Real-time Weather & Airport Info",
  "Advanced E6B Flight Computer",
  "Discover RhumbNav",
  "The dedicated platform for the bouldering community. Built to help you understand your progression, map your local gym's grading, and push your limits.",
  "Log climbs with custom gym color-grading systems.",
  "Deep analytics on your bouldering performance.",
  "Track progression across multiple gyms.",
  "Community-driven session logging.",
  "Discover Pogo"
];

singles.forEach(s => {
    lp = lp.replace(new RegExp(`>\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`), `>{t('${Math.random()}')}<`); // Wait I'll just use string replacement
    lp = lp.split(s).join(`{t('${s}')}`);
});

fs.writeFileSync('src/pages/LandingPage.tsx', lp);

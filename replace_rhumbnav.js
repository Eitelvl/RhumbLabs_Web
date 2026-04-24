const fs = require('fs');
let content = fs.readFileSync('src/pages/LegalPage.tsx', 'utf8');

// The main replacement for text:
content = content.replace(/RhumbNav/g, "{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}");

// We might have messed up imports or variables if there were any, let's fix known ones:
content = content.replace(/\{selectedApp === 'rhumbnav' \? 'RhumbNav' : 'Pogo'\}Page/g, 'RhumbNavPage');
content = content.replace(/\{selectedApp === 'rhumbnav' \? 'RhumbNav' : 'Pogo'\} Documents/g, "{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'} Documents");

fs.writeFileSync('src/pages/LegalPage.tsx', content);

import fs from 'fs';
const file = './src/pages/LegalPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/selection:bg-primary\/30/g, 'selection:bg-white/20');
content = content.replace(/text-primary/g, 'text-white');
content = content.replace(/bg-primary\/10/g, 'bg-white/5');
content = content.replace(/hover:bg-primary\/20/g, 'hover:bg-white/10');

fs.writeFileSync(file, content, 'utf8');
console.log('Done!');

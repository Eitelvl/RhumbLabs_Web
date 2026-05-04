import fs from 'fs';
const file = './src/pages/LegalPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/text-on-surface-variant/g, 'text-[#a1a1aa]');
content = content.replace(/text-on-surface/g, 'text-white');
content = content.replace(/bg-surface-container-low/g, 'bg-white/10');
content = content.replace(/bg-surface-container-highest/g, 'bg-white/5');
content = content.replace(/border-on-surface/g, 'border-white');
content = content.replace(/bg-surface/g, 'bg-black');
content = content.replace(/border-\[\#424854\]\/15/g, 'border-white/10');
content = content.replace(/text-\[\#c8d8f3\]\/60/g, 'text-[#a1a1aa]');
content = content.replace(/text-\[\#c8d8f3\]/g, 'text-[#a1a1aa]');
content = content.replace(/hover:text-\[\#81ecff\]/g, 'hover:text-white');
content = content.replace(/text-\[\#e0e5f4\]/g, 'text-white');

fs.writeFileSync(file, content, 'utf8');
console.log('Done!');

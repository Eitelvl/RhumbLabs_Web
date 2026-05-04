const fs = require('fs');
const file = './src/pages/LegalPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className="max-w-3xl space-y-6 text-on-surface-variant"/g, 'className="max-w-3xl space-y-6 text-[#a1a1aa] font-light"');

content = content.replace(/className="bg-surface-container-high p-6 rounded-xl border border-outline-variant\/10/g, 'className="bg-white/5 p-6 rounded-xl border border-white/10');

content = content.replace(/<span className="font-bold text-on-surface">/g, '<span className="font-semibold text-white">');

content = content.replace(/className="text-xl font-bold text-on-surface/g, 'className="text-xl font-semibold text-white');

fs.writeFileSync(file, content, 'utf8');
console.log('Done!');

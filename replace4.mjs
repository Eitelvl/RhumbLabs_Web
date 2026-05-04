import fs from 'fs';

const files = ['./src/pages/PrivacyPage.tsx', './src/pages/TermsPage.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/bg-surface text-on-surface selection:bg-primary\/30/g, 'bg-black text-white selection:bg-white/20');
  content = content.replace(/text-4xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-12/g, 'text-5xl md:text-[5.5rem] font-medium tracking-tight mb-16 leading-[0.9] text-white');
  content = content.replace(/<span className="text-primary">/g, '<span className="text-[#a1a1aa]">');
  content = content.replace(/text-on-surface-variant font-manrope/g, 'text-[#a1a1aa] font-light');
  content = content.replace(/text-sm font-bold uppercase tracking-widest text-primary\/60 mb-8/g, 'text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] mb-12');
  content = content.replace(/text-xl font-bold text-on-surface mb-4/g, 'text-xl font-medium text-white mb-6');
  
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Done!');

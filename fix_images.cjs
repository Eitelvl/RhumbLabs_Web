const fs = require('fs');
const path = require('path');

const restoreFiles = {
  'src/pages/PogoPage.tsx': [
    ['src={`${import.meta.env.BASE_URL}`} alt="Pogo Logo" className="show-in-light', 'src={`${import.meta.env.BASE_URL}pogo/Pogo5.png`} alt="Pogo Logo" className="show-in-light'],
    ['src={`${import.meta.env.BASE_URL}`} alt="Pogo Logo" className="show-in-dark', 'src={`${import.meta.env.BASE_URL}pogo/Pogo2.png`} alt="Pogo Logo" className="show-in-dark']
  ],
  'src/pages/LandingPage.tsx': [
    ['src={`${import.meta.env.BASE_URL}`} alt="RhumbNav" className="show-in-light', 'src={`${import.meta.env.BASE_URL}pogo/RN2.png`} alt="RhumbNav" className="show-in-light'],
    ['src={`${import.meta.env.BASE_URL}`} alt="RhumbNav" className="show-in-dark', 'src={`${import.meta.env.BASE_URL}logo_horizontal.png`} alt="RhumbNav" className="show-in-dark'],
    ['src={`${import.meta.env.BASE_URL}`} alt="Pogo" className="show-in-light', 'src={`${import.meta.env.BASE_URL}pogo/Pogo5.png`} alt="Pogo" className="show-in-light'],
    ['src={`${import.meta.env.BASE_URL}`} alt="Pogo" className="show-in-dark', 'src={`${import.meta.env.BASE_URL}pogo/Pogo2.png`} alt="Pogo" className="show-in-dark']
  ],
  'src/pages/OldLegalPage.tsx': [
    ['src={`${import.meta.env.BASE_URL}`} alt="Rhumb Labs" className="show-in-light', 'src={`${import.meta.env.BASE_URL}pogo/RL1N.png`} alt="Rhumb Labs" className="show-in-light'],
    ['src={`${import.meta.env.BASE_URL}`} alt="Rhumb Labs" className="show-in-dark', 'src={`${import.meta.env.BASE_URL}pogo/RL1.png`} alt="Rhumb Labs" className="show-in-dark']
  ],
  'src/pages/RhumbNavPage.tsx': [
    ['src={`${import.meta.env.BASE_URL}`} alt="RhumbNav Logo" className="show-in-light', 'src={`${import.meta.env.BASE_URL}pogo/RN2.png`} alt="RhumbNav Logo" className="show-in-light'],
    ['src={`${import.meta.env.BASE_URL}`} alt="RhumbNav Logo" className="show-in-dark', 'src={`${import.meta.env.BASE_URL}logo_horizontal.png`} alt="RhumbNav Logo" className="show-in-dark']
  ]
};

for (const [file, replacements] of Object.entries(restoreFiles)) {
  let content = fs.readFileSync(file, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

// Now replace remaining src="/..." cases across the repo
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
};

const files = walk('./src');
files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace src="/xyz" exactly, ensuring it's an image.
  content = content.replace(/src="\/([^"]+\.(png|jpe?g|webp|svg|gif))"/g, 'src={`${import.meta.env.BASE_URL}$1`}');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated remaining images in', file);
  }
});
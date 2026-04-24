import fs from 'fs';

let content = fs.readFileSync('src/pages/LegalPage.tsx', 'utf8');

// We have many "RhumbNav" occurrences in the text.
// Some are inside `alt="RhumbNav"` or attributes. We shouldn't replace those, 
// but wait, there are none! We checked with `grep`.
// We will replace "RhumbNav" and "rhumbnav" where appropriate.
// However, ONLY inside the paragraphs and headings! Not in imports, tags, etc.
// The safe way is to split the document into pre-content and content (around the <div className="space-y-40 legal-text">) and only modify the content.
const startIdx = content.indexOf('<div className="space-y-40 legal-text">');
if (startIdx !== -1) {
    let before = content.slice(0, startIdx);
    let after = content.slice(startIdx);
    
    // In the after part, replace "RhumbNav" with "{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}"
    after = after.replace(/RhumbNav/g, "{selectedApp === 'rhumbnav' ? 'RhumbNav' : 'Pogo'}");
    after = after.replace(/rhumbnav/g, "{selectedApp === 'rhumbnav' ? 'rhumbnav' : 'pogo'}"); // lowercase cases? 
    
    // Oh wait, if there are classes or IDs with rhumbnav, that could break. 
    // Are there any id or class with rhumbnav inside there?
    // Looking at the grep earlier: there were none. Let's not risk replacing lowercase 'rhumbnav' unless we have to.
    
    content = before + after;
    fs.writeFileSync('src/pages/LegalPage.tsx', content);
    console.log("Successfully replaced RhumbNav text in legal page.");
} else {
    console.log("Could not find legal-text tag.");
}

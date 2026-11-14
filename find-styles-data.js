const fs = require('fs');
const path = require('path');

const folders = fs.readdirSync('concept_src').filter(f => fs.statSync(path.join('concept_src', f)).isDirectory());

for (const folder of folders) {
  const files = fs.readdirSync(path.join('concept_src', folder)).filter(f => f.endsWith('.js') && f.length > 25);
  for (const jsFile of files) {
    const js = fs.readFileSync(path.join('concept_src', folder, jsFile), 'utf8');
    // Look for occurrences of colors or mock data objects like "Table 1", "AVAILABLE", etc.
    const hexes = [...new Set(js.match(/#[0-9a-fA-F]{3,8}\b/g) || [])];
    console.log(`\n=== ${folder} / ${jsFile} ===`);
    console.log('Hex colors:', hexes);
    
    // Look for table or mock arrays
    const strMatches = [...js.matchAll(/"([^"]{3,60})"/g)].map(m => m[1]).filter(s => s.includes('Table') || s.includes('Seats') || s.includes('clean') || s.includes('Biryani') || s.includes('Paneer') || s.includes('Occupied'));
    console.log('Key mock terms:', [...new Set(strMatches)].slice(0, 15));
  }
}


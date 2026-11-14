const fs = require('fs');

const markup = fs.readFileSync('concept_src/concept_0_Live_floor_map/ui_markup.html', 'utf8');
// remove the giant font base64 or style if any, and show the HTML
const withoutFonts = markup.replace(/@font-face[\s\S]*?\}\s*\}/g, '/* font */');
console.log('Markup snippet (first 3000 chars):\n', withoutFonts.substring(0, 3000));


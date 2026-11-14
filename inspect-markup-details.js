const fs = require('fs');

const f = 'concept_src/concept_0_Live_floor_map/ui_markup.html';
const content = fs.readFileSync(f, 'utf8');

// Find script tags with data-props or preview data
const scriptData = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Script count in markup:', scriptData.length);
for (const s of scriptData) {
  console.log('Script snippet:\n', s.substring(0, 500));
}

// Find styles in markup
const styles = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
console.log('Styles count:', styles.length);
if (styles.length > 0) {
  fs.writeFileSync('concept_src/concept_0_Live_floor_map/extracted_styles.css', styles.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n\n'));
  console.log('Saved extracted_styles.css');
}


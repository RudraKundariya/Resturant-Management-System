const fs = require('fs');
const path = require('path');

const folders = fs.readdirSync('concept_src').filter(f => fs.statSync(path.join('concept_src', f)).isDirectory());

for (const folder of folders) {
  const file = path.join('concept_src', folder, 'ui_markup.html');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // strip the massive base64 fonts
    content = content.replace(/@font-face\s*\{[\s\S]*?\}\s*/g, '');
    fs.writeFileSync(path.join('concept_src', `${folder}_clean.html`), content);
    console.log(`Saved concept_src/${folder}_clean.html (${content.length} chars)`);
  }
}


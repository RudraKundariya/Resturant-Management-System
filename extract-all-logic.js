const fs = require('fs');
const path = require('path');

const folders = fs.readdirSync('concept_src').filter(f => fs.statSync(path.join('concept_src', f)).isDirectory());

for (const folder of folders) {
  const tmplFile = path.join('concept_src', folder, 'template.html');
  if (fs.existsSync(tmplFile)) {
    const tmpl = fs.readFileSync(tmplFile, 'utf8');
    const match = tmpl.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/i);
    if (match) {
      const code = match[1];
      fs.writeFileSync(path.join('concept_src', `${folder}_logic.js`), code);
      console.log(`Saved concept_src/${folder}_logic.js (${code.length} chars)`);
    }
  }
}


const fs = require('fs');
const path = require('path');

const folders = fs.readdirSync('concept_src').filter(f => fs.statSync(path.join('concept_src', f)).isDirectory());

for (const folder of folders) {
  const tmplPath = path.join('concept_src', folder, 'template.html');
  if (fs.existsSync(tmplPath)) {
    const tmpl = fs.readFileSync(tmplPath, 'utf8');
    const xdcMatch = tmpl.match(/<x-dc[^>]*>([\s\S]*?)<\/x-dc>/i);
    if (xdcMatch) {
      const xdcContent = xdcMatch[1];
      fs.writeFileSync(path.join('concept_src', folder, 'ui_markup.html'), xdcContent);
      console.log(`\n=================== ${folder} ===================`);
      console.log(`Markup length: ${xdcContent.length}`);
      
      // Look for buttons, headings, cards, text
      const cleanText = xdcContent
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<svg[\s\S]*?<\/svg>/gi, '[ICON]')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      console.log(`Text summary (first 500 chars):\n${cleanText.substring(0, 500)}`);
    }
  }
}


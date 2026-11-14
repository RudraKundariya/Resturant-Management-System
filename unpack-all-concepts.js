const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const files = [
  'concept_0_Live_floor_map.html',
  'concept_1_Reports.html',
  'concept_2_Kitchen_display.html',
  'concept_3_Guest_menu_and_cart.html',
  'concept_4_Guest_order_status_and_payment.html',
  'concept_5_Staff_cleaning_tasks.html'
];

fs.mkdirSync(path.join(__dirname, 'concept_src'), { recursive: true });

for (const f of files) {
  const baseName = f.replace('.html', '');
  const outDir = path.join(__dirname, 'concept_src', baseName);
  fs.mkdirSync(outDir, { recursive: true });
  
  const content = fs.readFileSync(f, 'utf8');
  
  // Extract template
  const tmplMatch = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
  if (tmplMatch) {
    try {
      const tmpl = JSON.parse(tmplMatch[1].trim());
      fs.writeFileSync(path.join(outDir, 'template.html'), tmpl);
    } catch(e) {
      fs.writeFileSync(path.join(outDir, 'template.raw'), tmplMatch[1]);
    }
  }

  // Extract manifest JS files
  const manifestMatch = content.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
  if (manifestMatch) {
    try {
      const manifest = JSON.parse(manifestMatch[1]);
      for (const [key, entry] of Object.entries(manifest)) {
        const buf = Buffer.from(entry.data, 'base64');
        const text = entry.compressed ? zlib.gunzipSync(buf).toString('utf8') : buf.toString('utf8');
        const ext = entry.mime === 'text/javascript' ? 'js' : (entry.mime === 'text/css' ? 'css' : 'bin');
        fs.writeFileSync(path.join(outDir, `${key}.${ext}`), text);
        console.log(`Saved ${baseName}/${key}.${ext} (${text.length} chars)`);
      }
    } catch (e) {
      console.error(`Error in ${f}:`, e);
    }
  }
}
console.log('Finished unpacking all concept source files into concept_src/');


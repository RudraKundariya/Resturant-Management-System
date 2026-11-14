const fs = require('fs');

const tmpl = fs.readFileSync('concept_src/concept_0_Live_floor_map/template.html', 'utf8');
const scripts = [...tmpl.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Scripts in template.html:', scripts.length);
scripts.forEach((s, i) => {
  console.log(`Script ${i}:`, s[0].substring(0, 150));
  if (s[1].length > 0) {
    console.log(`Script ${i} length: ${s[1].length}, content sample:\n`, s[1].substring(0, 500));
  }
});


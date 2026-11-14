const fs = require('fs');

const tmpl = fs.readFileSync('concept_src/concept_0_Live_floor_map/template.html', 'utf8');
console.log('Template length:', tmpl.length);
console.log('Template head/style snippet:\n', tmpl.substring(0, 1500));

const js = fs.readFileSync('concept_src/concept_0_Live_floor_map/91f71bc3-c9ae-4c9c-963b-fd168c942ece.js', 'utf8');
console.log('JS length:', js.length);
console.log('JS first 1000 chars:\n', js.substring(0, 1000));


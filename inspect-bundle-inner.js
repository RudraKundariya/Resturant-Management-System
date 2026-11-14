const fs = require('fs');

const content = fs.readFileSync('concept_0_Live_floor_map.html', 'utf8');
const scriptMatches = content.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Script count in concept_0:', scriptMatches.length);
for (let i = 0; i < scriptMatches.length; i++) {
  console.log(`Script ${i} length: ${scriptMatches[i].length}`);
  console.log(`Script ${i} snippet:`, scriptMatches[i].substring(0, 300));
}


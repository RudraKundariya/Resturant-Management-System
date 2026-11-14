const fs = require('fs');

const raw = fs.readFileSync('concept_0_Live_floor_map.html', 'utf8');

// Look for data-props or preview or any JSON objects
const jsonMatches = [...raw.matchAll(/data-props="([^"]+)"/g)];
console.log('data-props matches:', jsonMatches.length);
if (jsonMatches.length > 0) {
  console.log('Sample data-props:', jsonMatches[0][1].substring(0, 500));
}

// Check if there are other script tags or JSON in raw
const scriptMatches = [...raw.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
scriptMatches.forEach((m, i) => {
  console.log(`Script ${i} tag:`, m[0].substring(0, 100));
  if (m[1].includes('{') && m[1].includes('}')) {
    // print some keys or sample
    const sample = m[1].trim().substring(0, 300);
    console.log(`   Sample content:`, sample);
  }
});


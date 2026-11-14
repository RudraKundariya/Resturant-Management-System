const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const filePath = path.join(__dirname, 'Restaurant Management System – UI Concept.html');
const html = fs.readFileSync(filePath, 'utf8');

const manifestMatch = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (manifestMatch) {
  const manifest = JSON.parse(manifestMatch[1]);
  let idx = 0;
  for (const [key, entry] of Object.entries(manifest)) {
    if (entry.mime === 'text/html' || entry.mime?.includes('html')) {
      const buf = Buffer.from(entry.data, 'base64');
      const text = entry.compressed ? zlib.gunzipSync(buf).toString('utf8') : buf.toString('utf8');
      const titleMatch = text.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : `concept_${idx}`;
      const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const outName = `concept_${idx}_${safeTitle}.html`;
      fs.writeFileSync(path.join(__dirname, outName), text);
      console.log(`Saved ${outName} (ID: ${key}, size: ${text.length}) - Title: ${title}`);
      
      // Also grab key headings or identifiers in the HTML
      const h1s = [...text.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).slice(0, 5);
      console.log('   Headings:', h1s);
      idx++;
    }
  }
}

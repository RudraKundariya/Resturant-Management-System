const fs = require('fs');

const files = [
  'concept_0_Live_floor_map.html',
  'concept_1_Reports.html',
  'concept_2_Kitchen_display.html',
  'concept_3_Guest_menu_and_cart.html',
  'concept_4_Guest_order_status_and_payment.html',
  'concept_5_Staff_cleaning_tasks.html'
];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`\n=================== ${f} ===================`);
  // Look for body or main content
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    // Look for styles, fonts or CDNs
    const cdnMatches = content.match(/https?:\/\/[^\s"']+/g) || [];
    const uniqueCdns = [...new Set(cdnMatches.filter(u => u.includes('font') || u.includes('tailwind') || u.includes('lucide') || u.includes('cdn')))];
    console.log('Fonts / CDNs:', uniqueCdns);
    
    // Check some sample text or structure (first 1000 characters without tags)
    const stripped = bodyContent.replace(/<style[\s\S]*?<\/style>/gi, '')
                                .replace(/<script[\s\S]*?<\/script>/gi, '')
                                .replace(/<[^>]+>/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();
    console.log('Sample text:', stripped.substring(0, 400));
  }
}


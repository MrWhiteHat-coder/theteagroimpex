/*
  Sitemap generator — static Node script, no dependencies.
  Run: node generate-sitemap.js
  Reads products-data.js and writes sitemap.xml with all pages + product URLs.
  Re-run this whenever you add or rename products, then commit the result.
*/
const fs = require('fs');
const path = require('path');

const SITE = 'https://theteagroimpex.in';
const dataSrc = fs.readFileSync(path.join(__dirname, 'products-data.js'), 'utf8');

// Extract slugs + names without evaluating the browser global
const products = [...dataSrc.matchAll(/slug:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)'/g)]
  .map((m) => ({ slug: m[1], name: m[2] }));

const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/products', changefreq: 'weekly', priority: '0.9' }
];

const urls = [
  ...staticPages.map((p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
  ...products.map((p) => `  <url>
    <loc>${SITE}/products/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
].join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml);
console.log(`sitemap.xml written with ${staticPages.length} static pages + ${products.length} product URLs.`);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Configuration
const DOMAIN = 'https://www.kmti.com.ph'; // Update this with your actual domain
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Define all routes with their metadata
const routes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    path: '/about',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/services',
    priority: '0.9',
    changefreq: 'weekly'
  },
  {
    path: '/services/3d-modeling',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/services/2d-detailing',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/services/parts-inspection',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/services/machine-assembly',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/projects',
    priority: '0.9',
    changefreq: 'weekly'
  },
  {
    path: '/careers',
    priority: '0.7',
    changefreq: 'weekly'
  },
  {
    path: '/contact',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/sitemap',
    priority: '0.5',
    changefreq: 'monthly'
  },
  {
    path: '/legal-and-compliance',
    priority: '0.5',
    changefreq: 'yearly'
  }
];

// Generate XML sitemap
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${route.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

// Write sitemap to file
function writeSitemap() {
  try {
    const sitemap = generateSitemap();
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
    console.log('✅ Sitemap generated successfully at:', OUTPUT_PATH);
    console.log(`📄 Total URLs: ${routes.length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
writeSitemap();

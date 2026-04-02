/**
 * ConvertlyPro — Analytics Configuration
 * ═══════════════════════════════════════
 * SETUP INSTRUCTIONS:
 *
 * STEP 1 — Google Analytics 4:
 *   1. Go to https://analytics.google.com
 *   2. Create a new GA4 property for "convertlypro.com"
 *   3. Copy your Measurement ID (format: G-XXXXXXXXXX)
 *   4. Replace 'GA_MEASUREMENT_ID' below with your ID
 *
 * STEP 2 — Google Search Console:
 *   1. Go to https://search.google.com/search-console
 *   2. Add property → URL prefix → enter https://convertlypro.com
 *   3. Choose "HTML tag" verification method
 *   4. Copy the content="..." value from the meta tag
 *   5. Replace 'GSC_VERIFICATION_CODE' below with that value
 *
 * STEP 3 — Run this script to update all 47 pages at once:
 *   Open terminal in converter-site folder and run:
 *   node js/analytics-config.js --apply
 *
 * ═══════════════════════════════════════
 */

const CONFIG = {
  // ← REPLACE THIS with your GA4 Measurement ID
  GA_ID: 'GA_MEASUREMENT_ID',

  // ← REPLACE THIS with your Search Console verification code
  GSC_CODE: 'GSC_VERIFICATION',

  // Your domain (used for canonical URLs)
  DOMAIN: 'https://convertlypro.com',
};

// ── Node.js batch updater (run with: node analytics-config.js --apply) ──────
if (typeof require !== 'undefined' && process.argv.includes('--apply')) {
  const fs = require('fs');
  const path = require('path');
  const glob = require('glob').sync || (() => {
    // Fallback glob without dependency
    const { execSync } = require('child_process');
    return execSync('find .. -name "*.html" -not -path "*/node_modules/*"')
      .toString().trim().split('\n');
  });

  const BASE = path.join(__dirname, '..');
  const files = [
    ...require('fs').readdirSync(BASE).filter(f => f.endsWith('.html')).map(f => path.join(BASE, f)),
    ...require('fs').readdirSync(path.join(BASE,'tools')).filter(f => f.endsWith('.html')).map(f => path.join(BASE,'tools',f)),
    ...require('fs').readdirSync(path.join(BASE,'blog')).filter(f => f.endsWith('.html')).map(f => path.join(BASE,'blog',f)),
  ];

  let updated = 0;
  files.forEach(fpath => {
    let content = fs.readFileSync(fpath, 'utf8');
    let changed = false;

    if (CONFIG.GA_ID !== 'GA_MEASUREMENT_ID') {
      const newContent = content.replaceAll('GA_MEASUREMENT_ID', CONFIG.GA_ID);
      if (newContent !== content) { content = newContent; changed = true; }
    }
    if (CONFIG.GSC_CODE !== 'GSC_VERIFICATION') {
      const newContent = content.replaceAll('GSC_VERIFICATION', CONFIG.GSC_CODE);
      if (newContent !== content) { content = newContent; changed = true; }
    }

    if (changed) {
      fs.writeFileSync(fpath, content);
      updated++;
    }
  });

  console.log(`✅ Updated ${updated} HTML files with GA ID: ${CONFIG.GA_ID}`);
  console.log(`   Search Console: ${CONFIG.GSC_CODE}`);
  process.exit(0);
}

#!/usr/bin/env node

/**
 * Build script to inject bundled UI JavaScript into HTML template
 */

const fs = require('fs');

console.log('🔨 Building UI HTML...');

// Read the bundled JavaScript
const bundledJs = fs.readFileSync('dist/ui-bundle.js', 'utf8');

// Read the HTML template
const htmlTemplate = fs.readFileSync('src/ui.html', 'utf8');

// Inject the JavaScript into the HTML (before closing </body> tag)
const finalHtml = htmlTemplate.replace('</body>', `
  <script>
${bundledJs}
  </script>
</body>`);

// Write the final HTML file to root
fs.writeFileSync('ui.html', finalHtml);

console.log('✅ UI HTML built successfully!');
console.log('📄 Output: ui.html');

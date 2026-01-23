#!/usr/bin/env node

/**
 * Build script to intelligently merge New GitHub logic with Original UI logic
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Integrated UI HTML...');

// 1. Read files
const bundledJs = fs.readFileSync('dist/ui-bundle.js', 'utf8');
const originalLogic = fs.readFileSync('src/original_logic.js', 'utf8');
const htmlTemplate = fs.readFileSync('src/ui.html', 'utf8');

// 2. Prepare the combined script
const combinedJs = `
// --- PHASE 1: ORIGINAL LOGIC ---
${originalLogic}

// --- PHASE 2: NEW GITHUB & EXPORT LOGIC ---
${bundledJs}

// --- PHASE 3: INTEGRATION BRIDGE ---
(function() {
    console.log('Plugin Bridge Initialized');
})();
`;

// 3. Inject into HTML
// We look for </html> and insert the script before it, 
// correctly closing bodies and html tags.
// First, we remove any existing script tags at the very end if they exists
let baseHtml = htmlTemplate.split('</html>')[0];
if (baseHtml.includes('</body>')) {
  baseHtml = baseHtml.split('</body>')[0];
}

const finalHtml = `${baseHtml}
  <script>
${combinedJs}
  </script>
</body>
</html>`;

// 4. Write output
fs.writeFileSync('ui.html', finalHtml);
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/ui.html', finalHtml);
}

console.log('✅ Integrated UI built successfully!');
console.log('📄 Output: ui.html (Consolidated with all features)');

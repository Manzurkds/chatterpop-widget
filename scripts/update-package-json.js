
const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the build-widget script if it doesn't exist
if (!packageJson.scripts['build-widget']) {
  packageJson.scripts['build-widget'] = 'node scripts/build-widget.js';
}

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('Updated package.json with build-widget script');

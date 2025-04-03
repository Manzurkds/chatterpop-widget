
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const packageJsonPath = resolve(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Add the build-widget script if it doesn't exist
if (!packageJson.scripts['build-widget']) {
  packageJson.scripts['build-widget'] = 'node scripts/build-widget.js';
}

// Write updated package.json
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('Updated package.json with build-widget script');


import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the console inject script
const consoleScriptPath = resolve(__dirname, '../public/console-inject.js');
const consoleScript = readFileSync(consoleScriptPath, 'utf8');

// Create a minified version
// Note: This is a simple minification just for console use
// In production, you'd want to use a proper minifier
const minified = consoleScript
  .replace(/\/\/.+/g, '') // Remove comments
  .replace(/\s+/g, ' ')   // Replace multiple spaces with a single space
  .replace(/\s*{\s*/g, '{')
  .replace(/\s*}\s*/g, '}')
  .replace(/\s*:\s*/g, ':')
  .replace(/\s*;\s*/g, ';')
  .replace(/\s*,\s*/g, ',');

// Create output message with usage instructions
const output = `
// ChatterPop Console Injection Script
// 
// INSTRUCTIONS:
// 1. Copy the entire script below
// 2. Open the browser console on any website (F12 or right-click > Inspect > Console)
// 3. Paste the script and press Enter
// 4. The ChatterPop widget will be injected into the page
//
// NOTE: You need to update the cssUrl and jsUrl variables to point to your actual hosted files
// before using this in production.

${minified}

// Usage info:
console.log("ChatterPop widget injection script has been executed.");
console.log("To customize the widget, edit the 'config' object in the script.");
`;

// Write the result to a file
const outputPath = resolve(__dirname, '../widget-dist/chatterpop-console.js');
writeFileSync(outputPath, output, 'utf8');

console.log(`Console injection script created at: ${outputPath}`);

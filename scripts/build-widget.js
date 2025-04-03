
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.bright}${colors.magenta}Building ChatterPop standalone widget...${colors.reset}\n`);

// Build the project with production mode
console.log(`${colors.blue}→ Running production build...${colors.reset}`);
execSync('npm run build', { stdio: 'inherit' });

// Create a widget distribution directory
const distDir = resolve(__dirname, '../dist');
const widgetDir = resolve(__dirname, '../widget-dist');

if (!existsSync(widgetDir)) {
  mkdirSync(widgetDir);
}

// Copy the needed files to the widget distribution directory
console.log(`${colors.blue}→ Copying widget files to distribution folder...${colors.reset}`);
copyFileSync(
  resolve(distDir, 'chatterpop.iife.js'),
  resolve(widgetDir, 'chatterpop.js')
);
copyFileSync(
  resolve(distDir, 'chatterpop.css'),
  resolve(widgetDir, 'chatterpop.css')
);
copyFileSync(
  resolve(__dirname, '../public/widget-demo.html'),
  resolve(widgetDir, 'demo.html')
);

// Create a simple README for the widget distribution
writeFileSync(
  resolve(widgetDir, 'README.md'),
  `# ChatterPop Widget

This folder contains the standalone widget distribution files:

- \`chatterpop.js\` - The JavaScript bundle to include in your website
- \`chatterpop.css\` - The CSS styles for the widget
- \`demo.html\` - A simple demo showing how to use the widget

## Quick Start

1. Copy the \`chatterpop.js\` and \`chatterpop.css\` files to your website.
2. Include them in your HTML:
   \`\`\`html
   <link rel="stylesheet" href="./chatterpop.css">
   <script src="./chatterpop.js"></script>
   \`\`\`
3. Configure and initialize the widget:
   \`\`\`html
   <script>
     window.ChatterPopConfig = {
       botName: "AssistantBot",
       welcomeMessage: "👋 Hello! How can I help you today?",
       primaryColor: "#4F46E5"
     };
   </script>
   \`\`\`

See the \`demo.html\` file for a complete example.
`
);

console.log(`${colors.green}${colors.bright}✓ Widget build complete!${colors.reset}`);
console.log(`\nWidget files are available in the ${colors.yellow}widget-dist${colors.reset} folder:`);
console.log(`  - ${colors.yellow}chatterpop.js${colors.reset} - The JavaScript bundle`);
console.log(`  - ${colors.yellow}chatterpop.css${colors.reset} - The CSS styles`);
console.log(`  - ${colors.yellow}demo.html${colors.reset} - A simple demo\n`);
console.log(`Open ${colors.yellow}widget-dist/demo.html${colors.reset} in your browser to see the widget in action.`);

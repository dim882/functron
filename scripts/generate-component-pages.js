import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read the templates
const componentTemplate = fs.readFileSync(path.join(rootDir, 'src/dev/component.tpl.html'), 'utf-8');
const indexTemplate = fs.readFileSync(path.join(rootDir, 'src/dev/index.tpl.html'), 'utf-8');

// Get all component directories
const componentsDir = path.join(rootDir, 'src/components');
const components = fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Create dev directory if it doesn't exist
const devDir = path.join(rootDir, 'dev');
if (!fs.existsSync(devDir)) {
    fs.mkdirSync(devDir);
}

// Generate HTML files for each component
components.forEach(component => {
    const html = componentTemplate.replace(/{{componentName}}/g, component);
    fs.writeFileSync(path.join(devDir, `${component}.html`), html);
});

// Generate the component list HTML
const componentList = components
    .map(component => `<li><a href="${component}.html">${component}</a></li>`)
    .join('\n');

// Create the index page
const indexHtml = indexTemplate.replace('{{componentList}}', componentList);
fs.writeFileSync(path.join(devDir, 'index.html'), indexHtml); 
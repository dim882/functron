import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read the template
const template = fs.readFileSync(path.join(rootDir, 'src/dev/component.tpl.html'), 'utf-8');

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
    const html = template.replace(/{{componentName}}/g, component);
    fs.writeFileSync(path.join(devDir, `${component}.html`), html);
});

// Create an index page that links to all components
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Functron Components</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1 {
            margin-bottom: 2rem;
        }
        .component-list {
            list-style: none;
            padding: 0;
        }
        .component-list li {
            margin-bottom: 1rem;
        }
        .component-list a {
            display: block;
            padding: 1rem;
            background: #f5f5f5;
            border-radius: 4px;
            text-decoration: none;
            color: #333;
        }
        .component-list a:hover {
            background: #eee;
        }
    </style>
</head>
<body>
    <h1>Functron Components</h1>
    <ul class="component-list">
        ${components.map(component => `
            <li><a href="${component}.html">${component}</a></li>
        `).join('')}
    </ul>
</body>
</html>
`;

fs.writeFileSync(path.join(devDir, 'index.html'), indexHtml); 
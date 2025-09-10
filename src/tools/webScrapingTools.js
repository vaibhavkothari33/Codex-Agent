import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { URL } from 'url';

async function scrapeWebsite({ url, projectName, includeAssets = true }) {
    try {
        console.log(`🌐 Starting to scrape: ${url}`);
        
        // Launch browser
        const browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Set viewport and user agent
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        // Navigate to the page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Get the HTML content
        const html = await page.content();
        
        // Get computed styles for all elements
        const styles = await page.evaluate(() => {
            const styleSheets = [];
            for (let sheet of document.styleSheets) {
                try {
                    if (sheet.href && sheet.href.includes(window.location.origin)) {
                        styleSheets.push(sheet.href);
                    }
                } catch (e) {
                    // Cross-origin stylesheet, skip
                }
            }
            return styleSheets;
        });
        
        // Take a screenshot
        const screenshot = await page.screenshot({ fullPage: true });
        
        await browser.close();
        
        // Parse HTML with Cheerio
        const $ = cheerio.load(html);
        
        // Clean up the HTML
        const cleanedHtml = cleanHtml($, url);
        
        // Extract CSS
        let combinedCSS = '';
        for (const styleUrl of styles) {
            try {
                const cssResponse = await axios.get(styleUrl);
                combinedCSS += `/* From: ${styleUrl} */\n${cssResponse.data}\n\n`;
            } catch (error) {
                console.log(`⚠️ Could not fetch CSS from: ${styleUrl}`);
            }
        }
        
        // Create project structure
        const projectDir = projectName || `scraped-${new URL(url).hostname}`;
        await fs.ensureDir(projectDir);
        await fs.ensureDir(path.join(projectDir, 'src'));
        await fs.ensureDir(path.join(projectDir, 'public'));
        await fs.ensureDir(path.join(projectDir, 'src', 'components'));
        await fs.ensureDir(path.join(projectDir, 'src', 'assets'));
        
        // Save screenshot
        await fs.writeFile(path.join(projectDir, 'reference-screenshot.png'), screenshot);
        
        // Convert to React components
        const reactComponents = await convertToReact(cleanedHtml, combinedCSS, url);
        
        // Create React project files
        await createReactProject(projectDir, reactComponents, url);
        
        // Download assets if requested
        if (includeAssets) {
            await downloadAssets($, url, path.join(projectDir, 'src', 'assets'));
        }
        
        return `✅ Successfully scraped and converted ${url} to React project in ${projectDir}/
        
📁 Project Structure:
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Main.jsx
│   │   └── Footer.jsx
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── public/
├── package.json
└── reference-screenshot.png

🚀 To run the project:
cd ${projectDir}
npm install
npm run dev`;
        
    } catch (error) {
        return `❌ Web scraping failed: ${error.message}`;
    }
}

function cleanHtml($, baseUrl) {
    // Remove scripts and unwanted elements
    $('script, noscript, iframe, embed, object').remove();
    
    // Convert relative URLs to absolute
    $('img, link, a').each((i, elem) => {
        const $elem = $(elem);
        ['src', 'href'].forEach(attr => {
            const value = $elem.attr(attr);
            if (value && !value.startsWith('http') && !value.startsWith('//')) {
                try {
                    const absoluteUrl = new URL(value, baseUrl).href;
                    $elem.attr(attr, absoluteUrl);
                } catch (e) {
                    // Invalid URL, skip
                }
            }
        });
    });
    
    return $.html();
}

async function convertToReact(html, css, originalUrl) {
    const $ = cheerio.load(html);
    
    // Extract main sections
    const header = $('header, nav, .header, .navbar').first().html() || '';
    const main = $('main, .main, .content, #content').first().html() || $('body').children().not('header, nav, footer').html() || '';
    const footer = $('footer, .footer').first().html() || '';
    
    // Convert HTML to JSX
    const components = {
        Header: convertHtmlToJsx(header),
        Main: convertHtmlToJsx(main),
        Footer: convertHtmlToJsx(footer),
        App: `import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;`,
        CSS: css
    };
    
    return components;
}

function convertHtmlToJsx(html) {
    if (!html) return 'export default function Component() { return <div>Component content here</div>; }';
    
    // Basic HTML to JSX conversions
    let jsx = html
        .replace(/class=/g, 'className=')
        .replace(/for=/g, 'htmlFor=')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<br>/g, '<br />')
        .replace(/<hr>/g, '<hr />')
        .replace(/<img([^>]*?)>/g, '<img$1 />')
        .replace(/style="([^"]*)"/g, (match, styles) => {
            const styleObj = styles.split(';')
                .filter(s => s.trim())
                .map(s => {
                    const [key, value] = s.split(':').map(s => s.trim());
                    const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    return `${camelKey}: '${value}'`;
                })
                .join(', ');
            return `style={{${styleObj}}}`;
        });
    
    return `import React from 'react';

export default function Component() {
  return (
    <div>
      ${jsx}
    </div>
  );
}`;
}

async function createReactProject(projectDir, components, originalUrl) {
    // Create package.json
    const packageJson = {
        name: path.basename(projectDir),
        version: "0.1.0",
        private: true,
        dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-scripts": "5.0.1"
        },
        scripts: {
            "start": "react-scripts start",
            "dev": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject"
        },
        eslintConfig: {
            extends: ["react-app", "react-app/jest"]
        },
        browserslist: {
            production: [">0.2%", "not dead", "not op_mini all"],
            development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
        }
    };
    
    await fs.writeJSON(path.join(projectDir, 'package.json'), packageJson, { spaces: 2 });
    
    // Create public/index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Scraped and converted from ${originalUrl}" />
    <title>Scraped React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;
    
    await fs.writeFile(path.join(projectDir, 'public', 'index.html'), indexHtml);
    
    // Create src/index.js
    const indexJs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'index.js'), indexJs);
    
    // Create components
    await fs.writeFile(path.join(projectDir, 'src', 'App.jsx'), components.App);
    await fs.writeFile(path.join(projectDir, 'src', 'components', 'Header.jsx'), components.Header);
    await fs.writeFile(path.join(projectDir, 'src', 'components', 'Main.jsx'), components.Main);
    await fs.writeFile(path.join(projectDir, 'src', 'components', 'Footer.jsx'), components.Footer);
    
    // Create CSS files
    await fs.writeFile(path.join(projectDir, 'src', 'App.css'), components.CSS);
    await fs.writeFile(path.join(projectDir, 'src', 'index.css'), `
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`);
    
    // Create README
    const readme = `# Scraped React App

This React application was automatically generated by CODEX AI from: ${originalUrl}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

- \`src/components/\` - React components extracted from the original site
- \`src/assets/\` - Downloaded images and assets
- \`reference-screenshot.png\` - Screenshot of the original site for reference

## Available Scripts

- \`npm run dev\` - Runs the app in development mode
- \`npm run build\` - Builds the app for production
- \`npm test\` - Launches the test runner

## Notes

This is an automated conversion. You may need to:
- Adjust styling and layout
- Add proper React state management
- Implement interactive functionality
- Optimize images and assets
`;
    
    await fs.writeFile(path.join(projectDir, 'README.md'), readme);
}

async function downloadAssets($, baseUrl, assetsDir) {
    const images = [];
    
    $('img').each((i, elem) => {
        const src = $(elem).attr('src');
        if (src && (src.startsWith('http') || src.startsWith('//'))) {
            images.push(src);
        }
    });
    
    for (const imgUrl of images.slice(0, 10)) { // Limit to first 10 images
        try {
            const response = await axios.get(imgUrl, { responseType: 'stream' });
            const filename = path.basename(new URL(imgUrl).pathname) || `image-${Date.now()}.jpg`;
            const filepath = path.join(assetsDir, filename);
            
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            
        } catch (error) {
            console.log(`⚠️ Could not download image: ${imgUrl}`);
        }
    }
}

export const webScrapingTools = {
    scrapeWebsite
};
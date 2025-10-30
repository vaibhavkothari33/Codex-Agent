import fs from "fs";
import path from "path";
import { openaiClient } from '../ai/clients.js';

/**
 * Validate image file exists and has correct format
 * @param {string} filepath - Path to image file
 * @returns {string} - Validated filepath
 */
export function validateImage(filepath) {
  if (!fs.existsSync(filepath)) {
    throw new Error("Image file not found!");
  }
  if (!/\.(png|jpg|jpeg|webp)$/i.test(filepath)) {
    throw new Error("Only PNG/JPG/JPEG/WEBP files are allowed");
  }
  return filepath;
}

/**
 * Generate React component from image using OpenAI Vision
 * @param {string} filepath - Path to image file
 * @returns {Promise<string>} - Generated React component code
 */
export async function generateReactFromImage(filepath) {
  const imageBase64 = fs.readFileSync(filepath).toString("base64");
  const fileExtension = path.extname(filepath).toLowerCase();
  const mimeType = fileExtension === '.png' ? 'image/png' : 'image/jpeg';

  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a UI-to-React generator. Generate clean, production-ready React functional components using TailwindCSS. 

IMPORTANT RULES:
- Use modern React functional components with hooks
- Use TailwindCSS for ALL styling (no custom CSS)
- Include proper imports (React, Lucide icons if needed)
- Make components responsive and accessible
- Use semantic HTML elements
- Include proper TypeScript-style prop types in comments
- Return ONLY the JSX component code, no explanations
- Use modern React patterns (useState, useEffect when needed)
- Make the component interactive where appropriate`
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: "Convert this UI design into a single React functional component with TailwindCSS styling. Make it responsive and interactive." 
          },
          { 
            type: "image_url", 
            image_url: { url: `data:${mimeType};base64,${imageBase64}` }
          }
        ]
      }
    ],
    max_tokens: 4000
  });

  return response.choices[0].message.content;
}

/**
 * Create React UI component from image file
 * @param {Object} params - Parameters
 * @param {string} params.filepath - Path to image file
 * @param {string} params.outputFile - Output file path for React component
 * @param {string} params.componentName - Name of the React component
 * @returns {Promise<string>} - Success message
 */
export async function createReactUIFromImage({ filepath, outputFile, componentName }) {
  try {
    // Validate image file
    validateImage(filepath);
    
    console.log(`🖼️ Processing image: ${filepath}`);
    console.log(`🤖 Generating React component...`);
    
    // Generate React code from image
    const generatedCode = await generateReactFromImage(filepath);
    
    // Clean up the code and ensure proper component structure
    const cleanCode = cleanupGeneratedCode(generatedCode, componentName);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the component to file
    fs.writeFileSync(outputFile, cleanCode, "utf8");
    
    return `✅ React UI component generated successfully!

📁 Component saved to: ${outputFile}
🎯 Component name: ${componentName || 'GeneratedUI'}
📦 Ready to import and use in your React app

Example usage:
import ${componentName || 'GeneratedUI'} from './${path.basename(outputFile, '.jsx')}';

function App() {
  return <${componentName || 'GeneratedUI'} />;
}`;
    
  } catch (error) {
    return `❌ Failed to generate React UI from image: ${error.message}`;
  }
}

/**
 * Clean up and format generated code
 * @param {string} code - Generated code from AI
 * @param {string} componentName - Desired component name
 * @returns {string} - Cleaned up code
 */
function cleanupGeneratedCode(code, componentName = 'GeneratedUI') {
  let cleanCode = code;
  
  // Remove markdown code blocks if present
  cleanCode = cleanCode.replace(/```jsx?\n?/g, '').replace(/```\n?/g, '');
  
  // Ensure proper imports
  if (!cleanCode.includes('import React')) {
    cleanCode = `import React, { useState } from 'react';\n${cleanCode}`;
  }
  
  // Add Lucide React import if icons are used
  if (cleanCode.includes('lucide-react') && !cleanCode.includes('import {') && !cleanCode.includes('} from \'lucide-react\'')) {
    const iconMatches = cleanCode.match(/\b[A-Z][a-zA-Z]*(?=\s*size=|\s*className=|\s*\/>)/g);
    if (iconMatches) {
      const uniqueIcons = [...new Set(iconMatches)];
      cleanCode = `import { ${uniqueIcons.join(', ')} } from 'lucide-react';\n${cleanCode}`;
    }
  }
  
  // Ensure component has proper name
  if (componentName && componentName !== 'GeneratedUI') {
    cleanCode = cleanCode.replace(/const\s+\w+\s*=/, `const ${componentName} =`);
    cleanCode = cleanCode.replace(/export\s+default\s+\w+/, `export default ${componentName}`);
  }
  
  // Ensure export default exists
  if (!cleanCode.includes('export default')) {
    const componentMatch = cleanCode.match(/const\s+(\w+)\s*=/);
    if (componentMatch) {
      cleanCode += `\n\nexport default ${componentMatch[1]};`;
    }
  }
  
  return cleanCode;
}

/**
 * Generate multiple components from complex UI image
 * @param {Object} params - Parameters
 * @param {string} params.filepath - Path to image file
 * @param {string} params.outputDir - Output directory for components
 * @param {string} params.projectName - Name of the project
 * @returns {Promise<string>} - Success message
 */
export async function createReactProjectFromImage({ filepath, outputDir, projectName }) {
  try {
    validateImage(filepath);
    
    console.log(`🖼️ Processing complex UI image: ${filepath}`);
    console.log(`🏗️ Creating React project structure...`);
    
    const imageBase64 = fs.readFileSync(filepath).toString("base64");
    const fileExtension = path.extname(filepath).toLowerCase();
    const mimeType = fileExtension === '.png' ? 'image/png' : 'image/jpeg';

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a UI-to-React project generator. Analyze the UI and break it down into multiple reusable React components.

IMPORTANT RULES:
- Break complex UI into logical components (Header, Sidebar, MainContent, etc.)
- Use TailwindCSS for ALL styling
- Create a main App component that combines all parts
- Use modern React patterns with hooks
- Make components responsive and accessible
- Return a JSON structure with component files

Return format:
{
  "components": [
    {
      "filename": "Header.jsx",
      "code": "import React from 'react';\n\nconst Header = () => {\n  return (\n    <header>...</header>\n  );\n};\n\nexport default Header;"
    },
    {
      "filename": "App.jsx", 
      "code": "import React from 'react';\nimport Header from './Header';\n\nconst App = () => {\n  return (\n    <div>...</div>\n  );\n};\n\nexport default App;"
    }
  ]
}`
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Analyze this UI design and break it down into multiple React components. Create a complete project structure." 
            },
            { 
              type: "image_url", 
              image_url: { url: `data:${mimeType};base64,${imageBase64}` }
            }
          ]
        }
      ],
      max_tokens: 6000
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Create output directory
    const projectDir = path.join(outputDir, projectName || 'generated-ui-project');
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    
    // Create components directory
    const componentsDir = path.join(projectDir, 'src', 'components');
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }
    
    // Write all component files
    const createdFiles = [];
    for (const component of result.components) {
      const filePath = component.filename === 'App.jsx' 
        ? path.join(projectDir, 'src', component.filename)
        : path.join(componentsDir, component.filename);
      
      fs.writeFileSync(filePath, component.code, 'utf8');
      createdFiles.push(filePath);
    }
    
    return `✅ React project generated from image!

📁 Project created: ${projectDir}
📦 Components generated: ${result.components.length}

Created files:
${createdFiles.map(file => `• ${path.relative(process.cwd(), file)}`).join('\n')}

🚀 Next steps:
1. cd ${path.relative(process.cwd(), projectDir)}
2. npm install
3. npm run dev`;
    
  } catch (error) {
    return `❌ Failed to generate React project from image: ${error.message}`;
  }
}

export const imageTools = {
  createReactUIFromImage,
  createReactProjectFromImage,
  validateImage,
  generateReactFromImage
};
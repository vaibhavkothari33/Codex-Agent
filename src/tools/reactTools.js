import fs from 'fs-extra';
import path from 'path';
import { systemTools } from './systemTools.js';

const { executeCommand } = systemTools;

async function createReactProject({ projectName, appType = 'custom', description = '' }) {
  try {
    const projectDir = projectName || `react-app-${Date.now()}`;

    console.log(`🚀 Creating React project: ${projectDir}`);
    console.log(`📝 App type: ${appType}`);

    // Create project directory structure
    await fs.ensureDir(projectDir);
    await fs.ensureDir(path.join(projectDir, 'src'));
    await fs.ensureDir(path.join(projectDir, 'src', 'components'));
    await fs.ensureDir(path.join(projectDir, 'public'));

    // Create package.json
    await createPackageJson(projectDir, appType);

    // Create Vite config
    await createViteConfig(projectDir);

    // Create Tailwind config
    await createTailwindConfig(projectDir);

    // Create PostCSS config
    await createPostCSSConfig(projectDir);

    // Create index.html
    await createIndexHtml(projectDir, appType);

    // Create main.jsx
    await createMainJsx(projectDir);

    // Create flexible components
    await createFlexibleComponents(projectDir, appType, description);

    console.log(`📦 Installing dependencies...`);

    // Install dependencies
    const installCommand = `cd ${projectDir} && npm install`;
    await executeCommand(installCommand);

    return `✅ React project created successfully: ${projectDir}/

📁 Project Structure:
├── src/
│   ├── components/
│   │   ├── Header.jsx      # App header with navigation
│   │   ├── MainContent.jsx # Main content area
│   │   └── Sidebar.jsx     # Collapsible sidebar
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html

🚀 To start development:
cd ${projectDir}
npm run dev

🎯 Features included:
• Vite for fast development
• React 18 with modern patterns
• Tailwind CSS for styling
• Lucide React for icons
• Responsive design
• Flexible component structure
• ${description || 'Ready to customize for any use case'}

The development server will start on http://localhost:5173`;

  } catch (error) {
    return `❌ Failed to create React project: ${error.message}`;
  }
}

async function createFlexibleComponents(projectDir, appType, description) {
  const appName = appType === 'custom' ? 'My App' : appType.charAt(0).toUpperCase() + appType.slice(1);
  const appDescription = description || `A modern ${appName} built with React, Tailwind CSS, and best practices.`;

  // Create main App component
  const appComponent = `import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Add your data fetching logic here
  useEffect(() => {
    // Example: fetch data from API
    // fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        appName="${appName}"
      />
      
      <div className="flex">
        <Sidebar />
        <MainContent 
          data={data}
          loading={loading}
          searchTerm={searchTerm}
          description="${appDescription}"
        />
      </div>
    </div>
  );
}

export default App;`;

  await fs.writeFile(path.join(projectDir, 'src', 'App.jsx'), appComponent);

  // Create flexible Header component
  const headerComponent = `import React from 'react';
import { Search, Menu, Bell, User, Plus, Settings } from 'lucide-react';

const Header = ({ searchTerm, onSearchChange, appName }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {appName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{appName}</h1>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <User size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;`;

  await fs.writeFile(path.join(projectDir, 'src', 'components', 'Header.jsx'), headerComponent);

  // Create flexible MainContent component
  const mainContentComponent = `import React from 'react';
import { Star, Heart, Share2, Eye, Calendar, Tag } from 'lucide-react';

const MainContent = ({ data, loading, searchTerm, description }) => {
  // Sample data - replace with your actual data
  const sampleItems = [
    {
      id: 1,
      title: 'Sample Item 1',
      description: 'This is a sample item. Replace with your actual content.',
      image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Item+1',
      category: 'Category A',
      date: '2024-01-15',
      stats: { views: 1200, likes: 45 }
    },
    {
      id: 2,
      title: 'Sample Item 2',
      description: 'Another sample item with different content.',
      image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Item+2',
      category: 'Category B',
      date: '2024-01-14',
      stats: { views: 850, likes: 32 }
    },
    {
      id: 3,
      title: 'Sample Item 3',
      description: 'Third sample item for demonstration purposes.',
      image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Item+3',
      category: 'Category C',
      date: '2024-01-13',
      stats: { views: 2100, likes: 78 }
    }
  ];

  const items = data.length > 0 ? data : sampleItems;
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your App
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl">
          {description}
        </p>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredItems.length} results for "{searchTerm}"
          </p>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Tag size={12} className="mr-1" />
                  {item.category}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    {item.stats.views}
                  </span>
                  <span className="flex items-center">
                    <Heart size={14} className="mr-1" />
                    {item.stats.likes}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                    <Star size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600">
            {searchTerm ? \`No results for "\${searchTerm}"\` : 'No items available yet.'}
          </p>
        </div>
      )}
    </main>
  );
};

export default MainContent;`;

  await fs.writeFile(path.join(projectDir, 'src', 'components', 'MainContent.jsx'), mainContentComponent);

  // Create flexible Sidebar component
  const sidebarComponent = `import React, { useState } from 'react';
import { 
  Home, 
  Trending, 
  Bookmark, 
  Settings, 
  User, 
  BarChart3, 
  FileText, 
  Image, 
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Trending, label: 'Trending' },
    { icon: Bookmark, label: 'Saved' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: FileText, label: 'Documents' },
    { icon: Image, label: 'Images' },
    { icon: Video, label: 'Videos' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className={\`bg-white border-r border-gray-200 transition-all duration-300 \${
      isCollapsed ? 'w-16' : 'w-64'
    }\`}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <button
                  className={\`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors \${
                    item.active
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }\`}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active:</span>
                <span className="font-medium text-green-600">18</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;`;

  await fs.writeFile(path.join(projectDir, 'src', 'components', 'Sidebar.jsx'), sidebarComponent);

  // Create Tailwind CSS file
  const indexCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Custom animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom components */
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow;
  }
}`;

  await fs.writeFile(path.join(projectDir, 'src', 'index.css'), indexCSS);
}

async function createPackageJson(projectDir, appType = 'basic') {
  const packageJson = {
    "name": path.basename(projectDir),
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "lucide-react": "^0.294.0",
      "clsx": "^2.0.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.43",
      "@types/react-dom": "^18.2.17",
      "@vitejs/plugin-react": "^4.2.1",
      "autoprefixer": "^10.4.16",
      "eslint": "^8.55.0",
      "eslint-plugin-react": "^7.33.2",
      "eslint-plugin-react-hooks": "^4.6.0",
      "eslint-plugin-react-refresh": "^0.4.5",
      "postcss": "^8.4.32",
      "tailwindcss": "^3.3.6",
      "vite": "^5.0.8"
    }
  };

  await fs.writeJSON(path.join(projectDir, 'package.json'), packageJson, { spaces: 2 });
}

async function createViteConfig(projectDir) {
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`;

  await fs.writeFile(path.join(projectDir, 'vite.config.js'), viteConfig);
}

async function createTailwindConfig(projectDir) {
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), tailwindConfig);
}

async function createPostCSSConfig(projectDir) {
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

  await fs.writeFile(path.join(projectDir, 'postcss.config.js'), postcssConfig);
}

async function createIndexHtml(projectDir, appType = 'basic') {
  const titles = {
    youtube: 'YouTube Clone - React App',
    video: 'Video App - React',
    ecommerce: 'E-commerce Store - React',
    shop: 'Online Shop - React',
    blog: 'Blog App - React',
    dashboard: 'Dashboard - React',
    social: 'Social Media App - React',
    todo: 'Todo App - React',
    basic: 'React App'
  };

  const title = titles[appType.toLowerCase()] || 'React App';

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

  await fs.writeFile(path.join(projectDir, 'index.html'), indexHtml);
}

async function createMainJsx(projectDir) {
  const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

  await fs.writeFile(path.join(projectDir, 'src', 'main.jsx'), mainJsx);
}

async function runReactProject({ projectPath = '.' }) {
  try {
    console.log(`🚀 Starting React development server...`);

    // Check if package.json exists
    const packageJsonPath = path.join(projectPath, 'package.json');
    const exists = await fs.pathExists(packageJsonPath);

    if (!exists) {
      return `❌ No package.json found in ${projectPath}. Make sure you're in a React project directory.`;
    }

    // Start the development server
    const command = `cd ${projectPath} && npm run dev`;

    // Execute the command (this will start the server)
    executeCommand(command);

    return `🚀 Starting React development server...
        
The server will start on http://localhost:5173
Press Ctrl+C to stop the server when you're done.

If the browser doesn't open automatically, visit:
http://localhost:5173`;

  } catch (error) {
    return `❌ Failed to start React project: ${error.message}`;
  }
}

async function buildReactProject({ projectPath = '.' }) {
  try {
    console.log(`🏗️ Building React project for production...`);

    const command = `cd ${projectPath} && npm run build`;
    const result = await executeCommand(command);

    return `✅ React project built successfully!
        
📦 Build output is in the 'dist' folder.
🚀 Ready for deployment to:
• Vercel: vercel --prod
• Netlify: netlify deploy --prod --dir=dist
• GitHub Pages: npm install -g gh-pages && gh-pages -d dist

${result}`;

  } catch (error) {
    return `❌ Build failed: ${error.message}`;
  }
}

async function installReactPackage({ packageName, isDev = false, projectPath = '.' }) {
  try {
    console.log(`📦 Installing ${packageName}...`);

    const devFlag = isDev ? '--save-dev' : '';
    const command = `cd ${projectPath} && npm install ${devFlag} ${packageName}`;
    const result = await executeCommand(command);

    return `✅ Successfully installed ${packageName}
        
${result}`;

  } catch (error) {
    return `❌ Failed to install ${packageName}: ${error.message}`;
  }
}

// New flexible tool for creating any type of React app
async function createCustomReactApp({ projectName, appType, description }) {
  return await createReactProject({
    projectName,
    appType: appType || 'custom',
    description
  });
}

async function createTodoAppWithDarkMode({ projectName }) {
  return await createReactProject({
    projectName: projectName || 'todo-app-dark-mode',
    appType: 'todo',
    description: 'A todo application with dark/light mode toggle and localStorage persistence.'
  });
}

export const reactTools = {
  createReactProject,
  createCustomReactApp,
  createTodoAppWithDarkMode,
  runReactProject,
  buildReactProject,
  installReactPackage
};
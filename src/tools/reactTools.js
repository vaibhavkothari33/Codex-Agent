import fs from 'fs-extra';
import path from 'path';
import { systemTools } from './systemTools.js';

const { executeCommand } = systemTools;

async function createReactProject({ projectName, includeDarkMode = false }) {
    try {
        const projectDir = projectName || `react-app-${Date.now()}`;
        
        console.log(`🚀 Creating React project: ${projectDir}`);
        
        // Create project directory structure
        await fs.ensureDir(projectDir);
        await fs.ensureDir(path.join(projectDir, 'src'));
        await fs.ensureDir(path.join(projectDir, 'src', 'components'));
        await fs.ensureDir(path.join(projectDir, 'public'));
        
        // Create package.json
        await createPackageJson(projectDir);
        
        // Create Vite config
        await createViteConfig(projectDir);
        
        // Create index.html
        await createIndexHtml(projectDir);
        
        // Create main.jsx
        await createMainJsx(projectDir);
        
        // Create components (with or without dark mode)
        if (includeDarkMode) {
            await createDarkModeComponents(projectDir);
        } else {
            await createBasicComponents(projectDir);
        }
        
        console.log(`📦 Installing dependencies...`);
        
        // Install dependencies
        const installCommand = `cd ${projectDir} && npm install`;
        await executeCommand(installCommand);
        
        return `✅ React project created successfully: ${projectDir}/

📁 Project Structure:
├── src/
│   ├── components/
│   │   ├── TodoApp.jsx    # Todo application component
│   │   ├── Header.jsx     # Header component
│   │   ${includeDarkMode ? '│   ├── ThemeToggle.jsx # Dark/Light mode toggle' : ''}
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── index.html

🚀 To start development:
cd ${projectDir}
npm run dev

🎯 Features included:
• Vite for fast development
• React 18 with modern patterns
• Lucide React for icons
• ${includeDarkMode ? 'Dark/Light mode toggle with localStorage' : 'Ready-to-use Todo app example'}
• Responsive design

The development server will start on http://localhost:5173`;
        
    } catch (error) {
        return `❌ Failed to create React project: ${error.message}`;
    }
}

async function createPackageJson(projectDir) {
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
            "eslint": "^8.55.0",
            "eslint-plugin-react": "^7.33.2",
            "eslint-plugin-react-hooks": "^4.6.0",
            "eslint-plugin-react-refresh": "^0.4.5",
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

async function createIndexHtml(projectDir) {
    const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Todo App</title>
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
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'main.jsx'), mainJsx);
}

async function createDarkModeComponents(projectDir) {
    // Create ThemeToggle component
    const themeToggleComponent = `import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={\`p-2 rounded-lg transition-colors \${
        isDark 
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }\`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'components', 'ThemeToggle.jsx'), themeToggleComponent);
    
    // Create Header component with theme toggle
    const headerComponent = `import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ isDark, toggleTheme }) => {
  return (
    <header className={\`p-4 shadow-md transition-colors \${
      isDark 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    }\`}>
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Todo App</h1>
          <p className={\`text-sm \${isDark ? 'text-gray-300' : 'text-gray-600'}\`}>
            Built with React + Vite
          </p>
        </div>
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};

export default Header;`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'components', 'Header.jsx'), headerComponent);
    
    // Create TodoApp component with dark mode support
    const todoAppComponent = `import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

const TodoApp = ({ isDark }) => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { 
        id: Date.now(), 
        text: inputValue, 
        completed: false 
      }]);
      setInputValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className={\`max-w-md mx-auto mt-8 p-6 rounded-lg shadow-lg transition-colors \${
      isDark 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    }\`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">
          My Todo List
        </h1>
        <p className={\`text-sm \${isDark ? 'text-gray-300' : 'text-gray-600'}\`}>
          {totalCount > 0 ? \`\${completedCount} of \${totalCount} completed\` : 'No todos yet'}
        </p>
      </div>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className={\`flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors \${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }\`}
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className={\`flex items-center p-3 rounded-lg transition-colors \${
            isDark 
              ? 'bg-gray-700' 
              : 'bg-gray-50'
          }\`}>
            <button
              onClick={() => toggleTodo(todo.id)}
              className={\`mr-3 p-1 rounded transition-colors \${
                todo.completed 
                  ? 'text-green-500 hover:text-green-600' 
                  : isDark 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-400 hover:text-gray-600'
              }\`}
            >
              {todo.completed ? <Check size={18} /> : <div className="w-[18px] h-[18px] border-2 border-current rounded"></div>}
            </button>
            <span className={\`flex-1 transition-all \${
              todo.completed 
                ? \`line-through \${isDark ? 'text-gray-400' : 'text-gray-500'}\`
                : isDark ? 'text-white' : 'text-gray-800'
            }\`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <div className="text-center mt-8">
          <div className={\`text-4xl mb-2 \${isDark ? 'text-gray-600' : 'text-gray-300'}\`}>
            📝
          </div>
          <p className={\`\${isDark ? 'text-gray-400' : 'text-gray-500'}\`}>
            No todos yet. Add one above!
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoApp;`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'components', 'TodoApp.jsx'), todoAppComponent);
    
    // Create App.jsx with dark mode support
    const appComponent = `import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TodoApp from './components/TodoApp';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={\`min-h-screen transition-colors \${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gray-100'
    }\`}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <div className="container mx-auto px-4 py-8">
        <TodoApp isDark={isDark} />
      </div>
    </div>
  );
}

export default App;`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'App.jsx'), appComponent);
    
    // Create enhanced App.css with dark mode support
    const appCSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  min-height: 100vh;
}

/* Utility Classes */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.max-w-md {
  max-width: 28rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mt-8 {
  margin-top: 2rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.mt-8 {
  margin-top: 2rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-4 {
  padding: 1rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-2 {
  padding: 0.5rem;
}

.p-1 {
  padding: 0.25rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

/* Colors */
.bg-white {
  background-color: white;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.bg-gray-300 {
  background-color: #d1d5db;
}

.bg-gray-600 {
  background-color: #4b5563;
}

.bg-gray-700 {
  background-color: #374151;
}

.bg-gray-800 {
  background-color: #1f2937;
}

.bg-gray-900 {
  background-color: #111827;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: white;
}

.text-gray-300 {
  color: #d1d5db;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-900 {
  color: #111827;
}

.text-yellow-400 {
  color: #fbbf24;
}

.text-green-500 {
  color: #10b981;
}

.text-green-600 {
  color: #059669;
}

.text-red-500 {
  color: #ef4444;
}

.text-red-600 {
  color: #dc2626;
}

.text-blue-500 {
  color: #3b82f6;
}

/* Layout */
.flex {
  display: flex;
}

.flex-1 {
  flex: 1 1 0%;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

/* Typography */
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.text-center {
  text-align: center;
}

/* Sizing */
.min-h-screen {
  min-height: 100vh;
}

.w-full {
  width: 100%;
}

/* Effects */
.line-through {
  text-decoration: line-through;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-l-lg {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.rounded-r-lg {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.rounded {
  border-radius: 0.25rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.border {
  border-width: 1px;
}

.border-2 {
  border-width: 2px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.border-gray-600 {
  border-color: #4b5563;
}

.border-current {
  border-color: currentColor;
}

/* Transitions */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus States */
.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Hover States */
.hover\\:bg-blue-600:hover {
  background-color: #2563eb;
}

.hover\\:bg-gray-300:hover {
  background-color: #d1d5db;
}

.hover\\:bg-gray-600:hover {
  background-color: #4b5563;
}

.hover\\:text-red-600:hover {
  color: #dc2626;
}

.hover\\:text-red-700:hover {
  color: #b91c1c;
}

.hover\\:text-gray-300:hover {
  color: #d1d5db;
}

.hover\\:text-gray-600:hover {
  color: #4b5563;
}

.hover\\:text-green-600:hover {
  color: #059669;
}

/* Placeholder */
.placeholder-gray-400::placeholder {
  color: #9ca3af;
}

.placeholder-gray-500::placeholder {
  color: #6b7280;
}`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'App.css'), appCSS);
}

async function createBasicComponents(projectDir) {
    // Create components directory
    await fs.ensureDir(path.join(projectDir, 'src', 'components'));
    
    // Create a simple Todo App component
    const todoAppComponent = `import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { 
        id: Date.now(), 
        text: inputValue, 
        completed: false 
      }]);
      setInputValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Todo App
      </h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus size={20} />
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <button
              onClick={() => toggleTodo(todo.id)}
              className={\`mr-3 p-1 rounded \${todo.completed ? 'text-green-600' : 'text-gray-400'}\`}
            >
              <Check size={18} />
            </button>
            <span className={\`flex-1 \${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No todos yet. Add one above!
        </p>
      )}
    </div>
  );
};

export default TodoApp;`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'components', 'TodoApp.jsx'), todoAppComponent);
    
    // Create a simple Header component
    const headerComponent = `import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold">My React App</h1>
        <p className="text-blue-100">Built with Vite + React</p>
      </div>
    </header>
  );
};

export default Header;`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'components', 'Header.jsx'), headerComponent);
    
    // Update App.jsx to use our components
    const appComponent = `import React from 'react';
import Header from './components/Header';
import TodoApp from './components/TodoApp';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <TodoApp />
      </div>
    </div>
  );
}

export default App;`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'App.jsx'), appComponent);
    
    // Update App.css with some basic styles
    const appCSS = `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
  text-align: left;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Basic utility classes */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.max-w-md {
  max-width: 28rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mt-8 {
  margin-top: 2rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-4 {
  padding: 1rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-1 {
  padding: 0.25rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.bg-white {
  background-color: white;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: white;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-500 {
  color: #6b7280;
}

.text-blue-100 {
  color: #dbeafe;
}

.text-green-600 {
  color: #059669;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-red-500 {
  color: #ef4444;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-l-lg {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.rounded-r-lg {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.rounded {
  border-radius: 0.25rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1 1 0%;
}

.items-center {
  align-items: center;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.font-bold {
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.min-h-screen {
  min-height: 100vh;
}

.line-through {
  text-decoration: line-through;
}

.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.hover\\:bg-blue-600:hover {
  background-color: #2563eb;
}

.hover\\:text-red-700:hover {
  color: #b91c1c;
}`;
    
    await fs.writeFile(path.join(projectDir, 'src', 'App.css'), appCSS);
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

async function createTodoAppWithDarkMode({ projectName }) {
    return await createReactProject({ 
        projectName: projectName || 'todo-app-dark-mode', 
        includeDarkMode: true 
    });
}

export const reactTools = {
    createReactProject,
    createTodoAppWithDarkMode,
    runReactProject,
    buildReactProject,
    installReactPackage
};
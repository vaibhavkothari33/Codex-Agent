```
 ██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗     █████╗ ██╗ 
██╔════╝██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝    ██╔══██╗██║ 
██║     ██║   ██║██║  ██║█████╗   ╚███╔╝     ███████║██║ 
██║     ██║   ██║██║  ██║██╔══╝   ██╔██╗     ██╔══██║██║ 
╚██████╗╚██████╔╝██████╔╝███████╗██╔╝ ██╗    ██║  ██║██║ 
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝ 
```

# CODEX AI - Advanced Coding Assistant

A powerful, modular AI coding assistant that supports multiple AI models with an intuitive terminal interface. Built with modern JavaScript and designed for developers who love clean, maintainable code.

## ✨ ASCII Art Generation

The beautiful ASCII header is generated using figlet with this code pattern:

```javascript
try {
    const asciiArt = await new Promise((resolve, reject) => {
        figlet.text('CODEX AI ', {
            font: 'ANSI Shadow',
            horizontalLayout: 'fitted'
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
    
    console.log(chalk.cyan(asciiArt));
} catch (error) {
    // Fallback display
    console.log(chalk.cyan.bold('🚀 CODEX AI - Advanced Coding Assistant'));
}
```

## 🚀 Features

- **🤖 Multi-Model AI Support**: Switch between OpenAI GPT-4o Mini and Google Gemini 2.0 Flash
- **⚛️ React.js Specialist**: Expert in React development with TypeScript, hooks, and modern patterns
- **🌐 Web Scraping**: Clone and convert websites to React projects automatically
- **🔧 Git Integration**: Complete version control workflow (add, commit, push)
- **📁 File Operations**: Create, read, update, delete files and directories
- **🎨 Beautiful Terminal UI**: ASCII art header with colorful, intuitive interface
- **⚡ Smart Responses**: Instant responses for common queries without API calls
- **🏗️ Project Scaffolding**: Automatically creates organized project structures
- **🔄 Modular Architecture**: Clean, maintainable, and extensible codebase
- **⌨️ Interactive CLI**: Arrow key navigation and modern terminal experience



## 🎯 Usage

### Commands
- `exit` / `quit` - End session
- `clear` - Clear screen and refresh header
- `help` - Show available commands and examples
- `model` - Switch between AI models (arrow key navigation)

### Example Queries
- "Create a React todo app with TypeScript"
- "Set up a Node.js API with Express"
- "Debug this JavaScript function"
- "Install and configure ESLint"
- "Create a Git repository and make first commit"

### Simple Responses
CODEX responds instantly to common queries without API calls:
- "hello", "hi", "hey"
- "thanks", "thank you"
- "what can you do", "capabilities"
- "good morning", "good afternoon", etc.

## 🔧 Available Tools

### 🔧 Development Tools
- `writeFile({ filepath, content })` - Create/update files with content
- `readFile({ filepath })` - Read file contents
- `deleteFile({ filepath })` - Delete files
- `listDirectory({ dirpath })` - List directory contents
- `createDirectory({ dirpath })` - Create directories
- `getFileInfo({ filepath })` - Get file metadata and stats

### ⚛️ React Development Tools
- `createReactProject({ projectName, includeDarkMode })` - Create new React project with modern setup
- `createTodoAppWithDarkMode({ projectName })` - Create Todo app with dark/light mode toggle
- `runReactProject({ projectPath })` - Start React development server (npm run dev)
- `buildReactProject({ projectPath })` - Build React project for production
- `installReactPackage({ packageName, isDev, projectPath })` - Install packages in React project

### 🌐 Web Scraping Tools
- `scrapeWebsite({ url, projectName, includeAssets })` - Clone websites and convert to React projects

### 🔍 Search & Analysis
- `searchInFiles({ pattern, directory, fileExtension })` - Search for patterns in files
- `executeCommand({ command })` - Execute terminal commands

### 📦 Package Management
- `installPackage({ packageName, isDev })` - Install npm packages
- `runTests({ testCommand })` - Run test suites

### 🔧 Version Control (Git)
- `gitCommand({ command })` - Execute any git command
- `gitAdd()` - Stage all changes for commit (git add .)
- `gitCommit({ message })` - Commit staged changes with message
- `gitPush({ branch })` - Push commits to remote (default: main)
- `gitStatus()` - Check repository status
- `gitWorkflow({ message, branch })` - Complete workflow: add, commit, push

### 🌤️ Utilities
- `getWeatherInfo(city)` - Get weather information
- `getSum({ a, b })` - Mathematical operations

## 🤖 Supported AI Models

### OpenAI GPT-4o Mini 🤖
- Fast and efficient
- Excellent for coding tasks
- JSON response format support

### Google Gemini 2.5 Flash ✨
- Latest experimental model
- Advanced reasoning capabilities
- Multimodal support

## 🏗️ Architecture Benefits

### Modular Design
- **Separation of Concerns**: Each module has a specific responsibility
- **Easy Maintenance**: Changes are isolated to relevant modules
- **Scalability**: Easy to add new features and tools
- **Testing**: Individual modules can be tested independently

### Clean Code Principles
- **Single Responsibility**: Each file/function has one clear purpose
- **DRY (Don't Repeat Yourself)**: Shared functionality is centralized
- **Readable**: Clear naming and organization
- **Extensible**: Easy to add new AI models, tools, or UI components

## 🔄 Adding New Features

### Adding a New Tool
1. Create the tool function in the appropriate file in `src/tools/`
2. Export it from the tool module
3. It will automatically be available to the AI

### Adding a New AI Model
1. Add model configuration to `src/config/models.js`
2. Implement the API call in `src/ai/processor.js`
3. Update the model selector choices

### Adding New UI Components
1. Add display functions to `src/ui/display.js`
2. Import and use in the main application flow

## 📝 Development

The modular structure makes development easier:

- **Hot Reloading**: Use `npm run dev` for development with auto-restart
- **Debugging**: Each module can be debugged independently
- **Code Organization**: Related functionality is grouped together
- **Import/Export**: Clean ES6 module system throughout

## 🚀 Performance

- **Lazy Loading**: Modules are loaded only when needed
- **Efficient Caching**: Model configurations and responses are cached
- **Minimal Dependencies**: Only essential packages are included
- **Fast Startup**: Optimized initialization process

---

**Built with ❤️ for developers who love clean, maintainable code!**
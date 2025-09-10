# CODEX AI - Advanced Coding Assistant

A powerful, modular AI coding assistant that supports multiple AI models with an intuitive terminal interface.

## 🚀 Features

- **Multi-Model Support**: Switch between OpenAI GPT-4o Mini and Google Gemini 2.0 Flash
- **Arrow Key Navigation**: Modern CLI interface for model selection
- **Comprehensive Tools**: File operations, Git commands, package management, and more
- **Smart Responses**: Quick responses for common queries without API calls
- **Project Scaffolding**: Automatically creates projects in organized folders
- **Modular Architecture**: Clean, maintainable codebase



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

### Development Tools
- `writeFile` - Create/update files with content
- `readFile` - Read file contents
- `deleteFile` - Delete files
- `listDirectory` - List directory contents
- `createDirectory` - Create directories
- `getFileInfo` - Get file metadata and stats

### Search & Analysis
- `searchInFiles` - Search for patterns in files
- `executeCommand` - Execute terminal commands

### Package Management
- `installPackage` - Install npm packages
- `runTests` - Run test suites

### Version Control
- `gitCommand` - Execute git commands

### Utilities
- `getWeatherInfo` - Get weather information
- `getSum` - Mathematical operations

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
// Simple responses for common queries
export function getSimpleResponse(query) {
    const lowerQuery = query.toLowerCase().trim();

    const simpleResponses = {
        'thanks': '🙏 You\'re welcome! Happy to help with your coding needs!',
        'thank you': '🙏 You\'re welcome! Happy to help with your coding needs!',
        'hello': '👋 Hello! I\'m CODEX AI, ready to help you with coding tasks!',
        'hi': '👋 Hi there! What coding challenge can I help you solve today?',
        'hey': '👋 Hey! Ready to build something awesome together?',
        'what can you do': `🚀 I can help you with:
   • Create React projects with TypeScript & Tailwind CSS
   • Clone websites and convert them to React apps
   • Build modern, responsive web applications
   • Set up development environments and tooling
   • Debug and optimize React components
   • Handle Git operations and deployment
   • And much more!`,
        'capabilities': `🛠️ My React.js specialties:
   • ⚛️ React projects with TypeScript & Tailwind CSS
   • 🌐 Web scraping and website cloning to React
   • 🎨 Modern UI components and responsive design
   • 🔧 Development tooling (ESLint, Prettier, Vite)
   • 📦 Package management and dependency handling
   • 🚀 Production builds and deployment setup
   • 🧪 Testing with Jest and React Testing Library
   • 🔄 State management and API integration`,
        'how are you': '🤖 I\'m running smoothly and ready to help with your coding projects!',
        'good morning': '🌅 Good morning! Ready to start coding something amazing?',
        'good afternoon': '☀️ Good afternoon! What project are we working on today?',
        'good evening': '🌆 Good evening! Let\'s build something great together!',
        'good night': '🌙 Good night! Sweet dreams of bug-free code!',
        'create react app': '⚛️ I can create a React project for you! Just tell me the project name and I\'ll set it up with TypeScript, Tailwind CSS, and modern best practices.',
        'react project': '⚛️ Ready to build something awesome with React! I can create projects, components, or help with any React development tasks.',
        'clone website': '🌐 I can scrape and clone websites, then convert them to React projects! Just provide the URL and I\'ll handle the rest.',
        'scrape website': '🌐 Web scraping is one of my specialties! I can clone any website and convert it to a modern React application.',
    };

    // Check for exact matches first
    if (simpleResponses[lowerQuery]) {
        return simpleResponses[lowerQuery];
    }

    // Check for greeting-only queries (avoid matching programming requests)
    const greetingOnlyQueries = ['hello', 'hi', 'hey', 'thanks', 'thank you', 'how are you', 'good morning', 'good afternoon', 'good evening', 'good night'];
    
    if (greetingOnlyQueries.includes(lowerQuery)) {
        return simpleResponses[lowerQuery];
    }

    return null; // No simple response found
}
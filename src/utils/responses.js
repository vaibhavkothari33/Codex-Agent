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
   • Create full-stack applications & projects
   • Debug and optimize code
   • Set up development environments
   • Manage packages and dependencies
   • Handle Git operations
   • Run tests and quality checks
   • File system operations
   • And much more!`,
        'capabilities': `🛠️ My capabilities include:
   • Full-stack development (React, Node.js, Python, etc.)
   • Project scaffolding and architecture
   • Code analysis and debugging
   • Package management (npm, pip, etc.)
   • Version control with Git
   • Testing and CI/CD setup
   • Database operations
   • API development and integration`,
        'how are you': '🤖 I\'m running smoothly and ready to help with your coding projects!',
        'good morning': '🌅 Good morning! Ready to start coding something amazing?',
        'good afternoon': '☀️ Good afternoon! What project are we working on today?',
        'good evening': '🌆 Good evening! Let\'s build something great together!',
        'good night': '🌙 Good night! Sweet dreams of bug-free code!',
    };

    // Check for exact matches first
    if (simpleResponses[lowerQuery]) {
        return simpleResponses[lowerQuery];
    }

    // Check for partial matches
    for (const [key, response] of Object.entries(simpleResponses)) {
        if (lowerQuery.includes(key)) {
            return response;
        }
    }

    return null; // No simple response found
}
import chalk from 'chalk';
import figlet from 'figlet';
import { getModelInfo, getCurrentModel } from '../config/models.js';

export async function printHeader() {
    console.clear();
    try {
        const asciiArt = await new Promise((resolve, reject) => {
            figlet.text('CODEX AI', {
                font: 'ANSI Shadow',
                horizontalLayout: 'fitted'
            }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
        console.log(chalk.cyan(asciiArt));
        console.log(chalk.gray('                    🚀 Advanced Coding Assistant 🚀'));
        console.log(chalk.gray('                  ═══════════════════════════════════'));

        // Show current model
        const modelInfo = getModelInfo();
        console.log(chalk.yellow(`                    ${modelInfo.icon} Current Model: ${modelInfo.name}`));
        console.log();
    } catch (error) {
        // Fallback if figlet fails
        console.log(chalk.cyan('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.cyan('║') + chalk.bold.white('                        🤖 CODEX AI                          ') + chalk.cyan('║'));
        console.log(chalk.cyan('║') + chalk.gray('                   Advanced AI Assistant                     ') + chalk.cyan('║'));
        console.log(chalk.cyan('╚══════════════════════════════════════════════════════════════╝'));

        // Show current model
        const modelInfo = getModelInfo();
        console.log(chalk.yellow(`Current Model: ${modelInfo.icon} ${modelInfo.name}`));
        console.log();
    }
}

export function printThinking(content) {
    console.log(chalk.yellow('🤔 ') + chalk.bold.yellow('THINKING:'));
    console.log(chalk.gray('   ' + content));
    console.log();
}

export function printAction(tool, input) {
    console.log(chalk.blue('⚡ ') + chalk.bold.blue('ACTION:'));
    console.log(chalk.cyan('   Tool: ') + chalk.white(tool));
    console.log(chalk.cyan('   Input: ') + chalk.gray(JSON.stringify(input, null, 2).replace(/\n/g, '\n          ')));
    console.log();
}

export function printObserve(content) {
    console.log(chalk.green('👁️  ') + chalk.bold.green('OBSERVE:'));
    console.log(chalk.white('   ' + content));
    console.log();
}

export function printOutput(content) {
    console.log(chalk.magenta('📤 ') + chalk.bold.magenta('OUTPUT:'));
    console.log(chalk.white('   ' + content));
    console.log();
    console.log(chalk.gray('─'.repeat(60)));
    console.log();
}

export function printSimpleResponse(response) {
    console.log(chalk.magenta('📤 ') + chalk.bold.magenta('CODEX:'));
    console.log(chalk.white('   ' + response));
    console.log();
    console.log(chalk.gray('─'.repeat(60)));
    console.log();
}

export function printWelcome() {
    console.log(chalk.green('🎯 Welcome to CODEX AI'));
    console.log();
    console.log(chalk.cyan('⚛️ Web Development:'));
    console.log(chalk.white('   • Create React projects with TypeScript & Tailwind CSS'));
    console.log(chalk.white('   • Modern component architecture & best practices'));
    console.log(chalk.white('   • Responsive design & accessibility standards'));
    console.log();
    console.log(chalk.cyan('🌐 Web Scraping & Cloning:'));
    console.log(chalk.white('   • Clone any website and convert to React'));
    console.log(chalk.white('   • Extract layouts, styles, and components'));
    console.log(chalk.white('   • Professional project structure & organization'));
    console.log();
    console.log(chalk.cyan('🛠️ Development Tools:'));
    console.log(chalk.white('   • Run dev servers, build for production'));
    console.log(chalk.white('   • Git operations & deployment setup'));
    console.log(chalk.white('   • Code analysis & optimization'));
    console.log();
    console.log(chalk.gray('💡 Commands: "exit", "quit", "clear", "help", "model"'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log();
}

export function printHelp() {
    console.log(chalk.cyan('🔧 Available Commands:'));
    console.log(chalk.white('   • exit/quit - End session'));
    console.log(chalk.white('   • clear - Clear screen'));
    console.log(chalk.white('   • help - Show this help'));
    console.log(chalk.white('   • model - Switch AI model'));
    console.log();
    console.log(chalk.cyan('⚛️ React Development Examples:'));
    console.log(chalk.white('   • "Create a React dashboard project"'));
    console.log(chalk.white('   • "Build a todo app with TypeScript"'));
    console.log(chalk.white('   • "Create a landing page with Tailwind CSS"'));
    console.log(chalk.white('   • "Run the development server"'));
    console.log();
    console.log(chalk.cyan('🌐 Web Scraping Examples:'));
    console.log(chalk.white('   • "Clone the UI of https://tailwindui.com"'));
    console.log(chalk.white('   • "Scrape vaibhavkothari.me and make a React version"'));
    console.log(chalk.white('   • "Convert this website to a React app: [URL]"'));
    console.log();
    console.log(chalk.cyan('🛠️ General Development:'));
    console.log(chalk.white('   • "Set up ESLint and Prettier"'));
    console.log(chalk.white('   • "Create a Git repository and make first commit"'));
    console.log(chalk.white('   • "Build the project for production"'));
    console.log();
}
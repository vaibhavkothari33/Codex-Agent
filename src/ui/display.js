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
    console.log(chalk.green('🎯 Welcome to CODEX AI - Your Advanced Coding Assistant!'));
    console.log();
    console.log(chalk.cyan('🚀 What I can help you with:'));
    console.log(chalk.white('   • Full-stack development & project scaffolding'));
    console.log(chalk.white('   • Code analysis, debugging & optimization'));
    console.log(chalk.white('   • Package management & dependency handling'));
    console.log(chalk.white('   • Git operations & version control'));
    console.log(chalk.white('   • Testing & quality assurance'));
    console.log(chalk.white('   • File system operations & project management'));
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
    console.log(chalk.cyan('🛠️ Example Queries:'));
    console.log(chalk.white('   • "Create a React todo app with TypeScript"'));
    console.log(chalk.white('   • "Debug this JavaScript function"'));
    console.log(chalk.white('   • "Set up a Node.js API with Express"'));
    console.log(chalk.white('   • "Install and configure ESLint"'));
    console.log(chalk.white('   • "Create a Git repository and make first commit"'));
    console.log();
}
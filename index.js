// CODEX AI - Advanced Coding Assistant
// Main entry point - clean and modular architecture

import chalk from 'chalk';
import { printHeader, printWelcome, printHelp, printSimpleResponse } from './src/ui/display.js';
import { showModelSelector } from './src/ui/modelSelector.js';
import { createReadlineInterface, askQuestion } from './src/utils/readline.js';
import { getSimpleResponse } from './src/utils/responses.js';
import { processQuery } from './src/core/processor.js';

async function main() {
    await printHeader();
    
    const rl = createReadlineInterface();
    const sessionId = `session-${Date.now()}`;
    
    printWelcome();

    while (true) {
        try {
            const userQuery = await askQuestion(rl, 'What can I help you with?');

            // Handle exit commands
            if (userQuery.toLowerCase() === 'exit' || userQuery.toLowerCase() === 'quit') {
                console.log(chalk.yellow('👋 Goodbye! Thanks for using CODEX AI!'));
                break;
            }

            // Handle clear command
            if (userQuery.toLowerCase() === 'clear') {
                await printHeader();
                printWelcome();
                continue;
            }

            // Handle help command
            if (userQuery.toLowerCase() === 'help') {
                printHelp();
                continue;
            }

            // Handle model switching
            if (userQuery.toLowerCase() === 'model') {
                const switched = await showModelSelector(rl);
                if (switched) {
                    await printHeader();
                    console.log(chalk.green('🎯 Welcome back! Ready to help with your coding tasks!'));
                    console.log();
                    console.log(chalk.gray('💡 Commands: "exit", "quit", "clear", "help", "model"'));
                    console.log(chalk.gray('─'.repeat(60)));
                    console.log();
                }
                continue;
            }

            // Handle empty queries
            if (userQuery.trim() === '') {
                console.log(chalk.red('Please enter a valid query.'));
                continue;
            }

            // Check for simple responses first
            const simpleResponse = getSimpleResponse(userQuery);
            if (simpleResponse) {
                printSimpleResponse(simpleResponse);
                continue;
            }

            // Process complex queries with AI
            await processQuery(userQuery, sessionId);

        } catch (error) {
            console.log(chalk.red('❌ An error occurred: ' + error.message));
        }
    }

    rl.close();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n👋 Goodbye! Thanks for using CODEX AI!'));
    process.exit(0);
});

// Start the application
main().catch(console.error);
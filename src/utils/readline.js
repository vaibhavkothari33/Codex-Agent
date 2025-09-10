import readline from 'readline';
import chalk from 'chalk';

export function createReadlineInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

export function askQuestion(rl, question) {
    return new Promise((resolve) => {
        rl.question(chalk.cyan('💬 ') + chalk.bold.white(question + ' '), resolve);
    });
}
import chalk from 'chalk';
import inquirer from 'inquirer';
import { availableModels, getCurrentModel, setCurrentModel, getModelInfo } from '../config/models.js';

export async function showModelSelector(rl) {
    // Temporarily close the readline interface to avoid conflicts
    rl.pause();
    
    console.log(chalk.cyan('🔄 ') + chalk.bold.cyan('AI MODEL SELECTOR'));
    console.log(chalk.gray('Use arrow keys to navigate, Enter to select, Esc to cancel'));
    console.log();

    const modelKeys = Object.keys(availableModels);
    const currentModel = getCurrentModel();
    
    const choices = modelKeys.map(key => {
        const model = availableModels[key];
        const isActive = key === currentModel;
        const status = isActive ? chalk.green(' (CURRENT)') : '';

        return {
            name: `${model.icon} ${model.name} - ${chalk.gray(model.description)}${status}`,
            value: key,
            short: model.name
        };
    });

    // Add a back option
    choices.push({
        name: chalk.gray('← Back to chat'),
        value: 'back',
        short: 'Back'
    });

    try {
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedModel',
                message: 'Select AI Model:',
                choices: choices,
                default: currentModel,
                pageSize: 10,
                loop: false
            }
        ]);

        // Resume the readline interface
        rl.resume();

        if (answer.selectedModel === 'back') {
            console.log(chalk.gray('Returning to chat...'));
            console.log();
            return false;
        }

        if (answer.selectedModel !== currentModel) {
            setCurrentModel(answer.selectedModel);
            const modelInfo = getModelInfo();
            console.log();
            console.log(chalk.green(`✅ Switched to ${modelInfo.icon} ${modelInfo.name}`));
            console.log(chalk.gray('Ready to accept queries with the new model!'));
            console.log();
            return true;
        } else {
            console.log();
            console.log(chalk.yellow('⚠️ Already using this model!'));
            console.log();
            return false;
        }

    } catch (error) {
        // User pressed Ctrl+C or Esc
        rl.resume();
        console.log();
        console.log(chalk.gray('Model selection cancelled'));
        console.log();
        return false;
    }
}
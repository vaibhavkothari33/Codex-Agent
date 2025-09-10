import chalk from 'chalk';
import { callAI } from '../ai/processor.js';
import { TOOLS_MAP } from '../tools/index.js';
import { SYSTEM_PROMPT } from '../config/prompts.js';
import { getModelInfo, getCurrentModel } from '../config/models.js';
import { printThinking, printAction, printObserve, printOutput } from '../ui/display.js';

export async function processQuery(userQuery) {
    const messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT,
        },
        {
            role: "user",
            content: userQuery
        }
    ];

    const modelInfo = getModelInfo();
    console.log(chalk.green('🚀 ') + chalk.bold.green('PROCESSING QUERY:'));
    console.log(chalk.white('   ' + userQuery));
    console.log(chalk.gray(`   Using: ${modelInfo.icon} ${modelInfo.name}`));
    console.log();
    console.log(chalk.gray('─'.repeat(60)));
    console.log();

    while (true) {
        try {
            const responseContent = await callAI(messages);

            messages.push({
                role: 'assistant',
                content: responseContent,
            });

            const parsed_response = JSON.parse(responseContent);

            if (parsed_response.step === "think") {
                printThinking(parsed_response.content);
                continue;
            }

            if (parsed_response.step === "output") {
                printOutput(parsed_response.content);
                break;
            }

            if (parsed_response.step === "action") {
                const tool = parsed_response.tool;
                const input = parsed_response.input;

                printAction(tool, input);

                if (!TOOLS_MAP[tool]) {
                    console.log(chalk.red('❌ Tool not found: ' + tool));
                    break;
                }

                const value = await TOOLS_MAP[tool](input);
                printObserve(value);

                messages.push({
                    role: "assistant",
                    content: JSON.stringify({ step: "observe", content: value }),
                });
                continue;
            }
        } catch (error) {
            console.log(chalk.red('❌ Error: ' + error.message));
            if (error.message.includes('API key')) {
                console.log(chalk.yellow('💡 Make sure you have set the correct API key in your .env file'));
                const currentModel = getCurrentModel();
                if (currentModel.includes('gemini')) {
                    console.log(chalk.gray('   Add: GEMINI_API_KEY=your_key_here'));
                } else {
                    console.log(chalk.gray('   Add: OPEN_AI_KEY=your_key_here'));
                }
            }
            break;
        }
    }
}
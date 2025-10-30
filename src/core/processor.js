import chalk from 'chalk';
import { callAI } from '../ai/processor.js';
import { TOOLS_MAP } from '../tools/index.js';
import { SYSTEM_PROMPT } from '../config/prompts.js';
import { getModelInfo, getCurrentModel } from '../config/models.js';
import { printThinking, printAction, printObserve, printOutput } from '../ui/display.js';
import { appendToHistory } from '../ai/memory.js';
import { printLastCallSummary, printSessionTotals, initSessionTotals } from '../ai/costTracker.js';
import { getCompiledGraph } from '../ai/graph.js';

export async function processQuery(userQuery, sessionId = 'default') {
    initSessionTotals(sessionId);
    // Initialize LangGraph (compiled instance, currently used as state container)
    getCompiledGraph();
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

    let firstIteration = true;
    while (true) {
        try {
            // Persist incoming user message only once per top-level turn
            if (firstIteration) {
                await appendToHistory(sessionId, 'user', userQuery);
            }

            const responseContent = await callAI(messages, sessionId);

            messages.push({
                role: 'assistant',
                content: responseContent,
            });
            await appendToHistory(sessionId, 'assistant', responseContent);

            const parsed_response = JSON.parse(responseContent);

            if (parsed_response.step === "think") {
                printThinking(parsed_response.content);
                printLastCallSummary(sessionId);
                continue;
            }

            if (parsed_response.step === "output") {
                printOutput(parsed_response.content);
                printLastCallSummary(sessionId);
                printSessionTotals(sessionId);
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
                await appendToHistory(sessionId, 'assistant', JSON.stringify({ step: 'observe', content: value }));
                continue;
            }
            firstIteration = false;
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
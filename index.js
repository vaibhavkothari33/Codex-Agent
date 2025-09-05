import { OpenAI } from 'openai';
import { exec } from "node:child_process"
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
dotenv.config()

const openaiapikey = process.env.OPEN_AI_KEY;

const client = new OpenAI({ apiKey: openaiapikey });

function getWeatherInfo(cityname) {
    return `${cityname} has 43 Degree C`;
}

function getSum({ a, b }) {
    return a + b;
}
function executeCommand(command) {
    const isWindows = process.platform === 'win32';

    // Optional: replace / with \ on Windows
    if (isWindows) {
        command = command.replace(/\//g, '\\');
    }

    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve(`stdout: ${stdout}\n${stderr}`);
        });
    });
}



async function writeFile({ filepath, content }) {
    const fullPath = path.resolve(filepath);
    const dir = path.dirname(fullPath);

    try {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, 'utf-8');
        return `✅ File written successfully to: ${fullPath}`;
    } catch (error) {
        return `❌ Failed to write file: ${error.message}`;
    }
}
async function readFile({ filepath }) {
    const fullPath = path.resolve(filepath);
    try {
        const content = await fs.readFile(fullPath, 'utf-8');
        return `📄 Content of ${filepath}:\n\n${content}`;
    } catch (error) {
        return `❌ Could not read file "${filepath}": ${error.message}`;
    }
}
const TOOLS_MAP = {
    getWeatherInfo: getWeatherInfo,
    getSum: getSum,
    executeCommand: executeCommand,
    writeFile: writeFile,
    readFile: readFile,
}
const SYSTEM_PROMPT = `
You are a helpful AI assistant designed to solve user queries using a structured reasoning approach called START → THINK → ACTION → OBSERVE → OUTPUT.

**Instructions:**
- In the START phase, the user provides a query.
- Then you THINK 3-4 times about how to solve it.
- If a tool is needed, call an ACTION step with:
  - "tool": name of the tool
  - "input": required input

- After ACTION, wait for OBSERVE — the result of the tool execution.
- Then proceed or conclude with an OUTPUT step.

**Available Tools:**

1. \`getWeatherInfo(city: string): string\`  
   → Returns the weather for the city.

2. \`executeCommand(command: string): string\`  
   → Executes a terminal command for windows and returns stdout/stderr.

3. \`getSum({ a: number, b: number }): number\`  
   → Adds two numbers.

4. \`writeFile({ filepath: string, content: string }): string\`  
   → Writes content to a file. Creates directories if needed.
   

---

**Your JSON response format must always be:**
- \`step\`: "think" | "action" | "observe" | "output"
- \`content\`: the message or reasoning
- Optional for "action": \`tool\`, \`input\`

---

**Example:**

START: Create an index.html file in ./todo-app with a basic HTML page.

THINK:
{ "step": "think", "content": "The user wants a basic HTML page. I need to use writeFile to create index.html." }

ACTION:
{
  "step": "action",
  "tool": "writeFile",
  "input": {
    "filepath": "./todo-app/index.html",
    "content": "<!DOCTYPE html><html><head><title>Todo App</title></head><body><h1>Todo</h1></body></html>"
  }
}

OBSERVE:
{ "step": "observe", "content": "✅ File written successfully to: ./todo-app/index.html" }

OUTPUT:
{ "step": "output", "content": "Created index.html with the basic HTML structure." }

---

Always return valid JSON object, and follow the format strictly.
`;



async function init() {
    const messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT,
        },
    ];

    // const userQuries = "What is the weather of greater noida and delhi";
    // const userQuries = "create a portfolio website using react js vite for vaibhav kothari get more info about it by searching him his username is vaibhavkothari33 please make it ui more better";
    const userQuries = "What is in my index.html of video-site modify it and add 5 more video in it and also nice css to buttons and add mor interactions";
    messages.push({ "role": "user", "content": userQuries })

    while (true) {
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            response_format: { type: 'json_object' },
            messages: messages,
        });

        messages.push({
            role: 'assistant',
            content: response.choices[0].message.content,
        });

        const parsed_responce = JSON.parse(response.choices[0].message.content);

        if (parsed_responce.step && parsed_responce.step === "think") {
            console.log(` Thinking: ${parsed_responce.content}`);
            continue;
        }
        if (parsed_responce.step && parsed_responce.step === "output") {
            console.log(` Output: ${parsed_responce.content}`);
            break;
        }
        if (parsed_responce.step && parsed_responce.step === "action") {
            const tool = parsed_responce.tool;
            const input = parsed_responce.input;
            console.log("Tool requested:", tool);
            console.log("Available tools:", Object.keys(TOOLS_MAP));

            const value = await TOOLS_MAP[tool](input);
            console.log(`Tools call ${tool}: (${input}): ${value}`);

            messages.push({
                role: "assistant",
                content: JSON.stringify({ step: "observe", content: value }),
            });
            continue;
        }
    }

}
init();
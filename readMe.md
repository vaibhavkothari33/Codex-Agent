# Codex Agent — Tool-Using AI Assistant

An intelligent AI agent built with Node.js and OpenAI's GPT-4.1-mini model that can reason, plan, and execute real-world tasks by calling tools such as shell commands, file operations, and more. This project demonstrates building a **structured reasoning agent** using the START → THINK → ACTION → OBSERVE → OUTPUT loop.

---

## Features

- **Multi-step Reasoning:** The AI agent THINKs multiple times before acting.
- **Tool Usage:** Can execute shell commands, read/write files, do math, and fetch mock weather info.
- **Structured JSON Responses:** The agent strictly follows a JSON format for communication.
- **Extensible Tools:** Easily add new tools to the agent.
- **Environment Config:** Uses `.env` for storing API keys securely.
- **OpenAI API Usage Checker:** Includes a script to check OpenAI API key quota and usage.

---

## Getting Started

### Prerequisites

- Node.js v18 or later (ESM support)
- An OpenAI API key with billing enabled
- Windows OS (current shell commands are Windows-specific)

### Setup

1. Clone this repository:

```bash
   git clone https://github.com/vaibhavkothari33/codex-agent.git
   cd codex-agent
```

2. Install dependencies:

```bash
   pnpm install
```

3. Create a `.env` file in the root directory with your OpenAI API key:

```env
   OPEN_AI_KEY=your_openai_api_key_here
```



## Usage

### Run the AI Agent

This agent runs a chat loop where it receives a user query, reasons about it, executes tools if needed, and outputs the final answer.

```bash
node index.js
or
pnpm dev
```

You can modify the initial user query in `index.js` on line \~57:

```js
const userQuries = "Create a new folder and in it write html css code for the todo application fully working";
```

### Tools Available

* `getWeatherInfo(city: string): string`
  Returns weather info for a city (mock data).

* `executeCommand(command: string): string`
  Runs a shell command on your Windows machine and returns the output.

* `getSum({ a: number, b: number }): number`
  Adds two numbers.

* `readFile({ filepath: string }): string`
  Reads the contents of a file (added for better Windows shell compatibility).

* `writeFile({ filepath: string, content: string }): string`
  Writes content to a file (planned/optional).

---

## How It Works

The AI follows this loop:

1. **START:** User query is sent.
2. **THINK:** Agent thinks deeply, multiple times.
3. **ACTION:** Agent decides to call a tool if needed.
4. **OBSERVE:** Agent receives tool output.
5. **OUTPUT:** Agent generates final answer.

The AI strictly responds in JSON format to communicate these steps and tool calls clearly.



## How to Extend

* **Add new tools:** Add functions and update `TOOLS_MAP` in `index.js`.
* **Improve reasoning:** Enhance the system prompt to add more complex planning steps.
* **Multi-turn conversation:** Build a CLI interface to accept ongoing user inputs.
* **Safety guards:** Add filters to prevent dangerous shell commands.
* **Cross-platform support:** Add shell command compatibility for Linux/macOS.

---

## Troubleshooting

* Ensure `.env` file exists with correct `OPEN_AI_KEY`.
* Use Node.js v18+ with native ES Modules support.
* On Windows, use compatible shell commands (`type`, `dir`).
* For missing packages, run `npm install node-fetch` or other dependencies.

---

## License

MIT License © Vaibhav Kothari

---

## Acknowledgments

* [OpenAI API](https://platform.openai.com/)
* Inspired by agent architectures like ReAct and LangChain

---

Feel free to open issues or contribute! 🚀


import { exec } from "node:child_process";

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

async function searchInFiles({ pattern, directory = '.', fileExtension = '*' }) {
    try {
        const searchCommand = process.platform === 'win32'
            ? `findstr /r /s /i "${pattern}" "${directory}\\*.${fileExtension === '*' ? '*' : fileExtension}"`
            : `grep -r -i "${pattern}" ${directory} --include="*.${fileExtension === '*' ? '*' : fileExtension}"`;

        const result = await executeCommand(searchCommand);
        return `🔍 Search results for "${pattern}":\n\n${result}`;
    } catch (error) {
        return `❌ Search failed: ${error.message}`;
    }
}

async function installPackage({ packageName, isDev = false }) {
    try {
        const command = `npm install ${isDev ? '--save-dev' : ''} ${packageName}`;
        const result = await executeCommand(command);
        return `📦 Package installation result:\n${result}`;
    } catch (error) {
        return `❌ Package installation failed: ${error.message}`;
    }
}

async function runTests({ testCommand = 'npm test' }) {
    try {
        const result = await executeCommand(testCommand);
        return `🧪 Test results:\n${result}`;
    } catch (error) {
        return `❌ Tests failed: ${error.message}`;
    }
}

async function gitCommand({ command }) {
    try {
        const result = await executeCommand(`git ${command}`);
        return `🔧 Git command result:\n${result}`;
    } catch (error) {
        return `❌ Git command failed: ${error.message}`;
    }
}

export const systemTools = {
    executeCommand,
    searchInFiles,
    installPackage,
    runTests,
    gitCommand
};
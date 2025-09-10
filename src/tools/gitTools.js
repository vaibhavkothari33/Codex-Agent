import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/**
 * Execute git commands
 * @param {string} command - Git command to execute
 * @returns {Promise<string>} - Command output
 */
async function gitCommand({ command }) {
    try {
        const { stdout, stderr } = await execAsync(`git ${command}`);
        const output = stdout.trim();
        const errors = stderr.trim();
        
        if (errors && !output) {
            return `⚠️ Git warning: ${errors}`;
        }
        
        return output ? `✅ ${output}` : `✅ Git command executed successfully`;
    } catch (error) {
        return `❌ Git command failed: ${error.message}`;
    }
}

/**
 * Add all changes to staging area
 * @returns {Promise<string>} - Status message
 */
async function gitAdd() {
    try {
        const { stdout, stderr } = await execAsync('git add .');
        return `✅ All changes staged for commit`;
    } catch (error) {
        return `❌ Failed to stage changes: ${error.message}`;
    }
}

/**
 * Commit changes with a message
 * @param {string} message - Commit message
 * @returns {Promise<string>} - Commit result
 */
async function gitCommit({ message }) {
    try {
        const { stdout, stderr } = await execAsync(`git commit -m "${message}"`);
        return `✅ Committed: ${message}`;
    } catch (error) {
        if (error.message.includes('nothing to commit')) {
            return `ℹ️ Nothing to commit - working tree clean`;
        }
        return `❌ Commit failed: ${error.message}`;
    }
}

/**
 * Push changes to remote repository
 * @param {string} branch - Branch name (default: main)
 * @returns {Promise<string>} - Push result
 */
async function gitPush({ branch = 'main' }) {
    try {
        const { stdout, stderr } = await execAsync(`git push origin ${branch}`);
        return `✅ Successfully pushed to origin/${branch}`;
    } catch (error) {
        return `❌ Push failed: ${error.message}`;
    }
}

/**
 * Get git status
 * @returns {Promise<string>} - Repository status
 */
async function gitStatus() {
    try {
        const { stdout } = await execAsync('git status --porcelain');
        if (!stdout.trim()) {
            return `✅ Working tree clean - no changes to commit`;
        }
        
        const { stdout: fullStatus } = await execAsync('git status');
        return `📊 Repository Status:\n${fullStatus}`;
    } catch (error) {
        return `❌ Failed to get status: ${error.message}`;
    }
}

/**
 * Complete git workflow: add, commit, and push
 * @param {string} message - Commit message
 * @param {string} branch - Branch name (default: main)
 * @returns {Promise<string>} - Workflow result
 */
async function gitWorkflow({ message, branch = 'main' }) {
    try {
        // Stage changes
        await execAsync('git add .');
        
        // Commit changes
        const { stdout: commitOutput } = await execAsync(`git commit -m "${message}"`);
        
        // Push changes
        await execAsync(`git push origin ${branch}`);
        
        return `🚀 Complete workflow successful!\n✅ Staged all changes\n✅ Committed: ${message}\n✅ Pushed to origin/${branch}`;
    } catch (error) {
        if (error.message.includes('nothing to commit')) {
            return `ℹ️ Nothing to commit - working tree clean`;
        }
        return `❌ Git workflow failed: ${error.message}`;
    }
}

export const gitTools = {
    gitCommand,
    gitAdd,
    gitCommit,
    gitPush,
    gitStatus,
    gitWorkflow
};
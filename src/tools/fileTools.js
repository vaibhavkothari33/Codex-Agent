import fs from 'fs/promises';
import path from 'path';

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

async function listDirectory({ dirpath = '.' }) {
    const fullPath = path.resolve(dirpath);
    try {
        const items = await fs.readdir(fullPath, { withFileTypes: true });
        const result = items.map(item => {
            const type = item.isDirectory() ? '📁' : '📄';
            return `${type} ${item.name}`;
        }).join('\n');
        return `📂 Directory listing for ${dirpath}:\n\n${result}`;
    } catch (error) {
        return `❌ Could not list directory "${dirpath}": ${error.message}`;
    }
}

async function deleteFile({ filepath }) {
    const fullPath = path.resolve(filepath);
    try {
        await fs.unlink(fullPath);
        return `🗑️ File deleted successfully: ${fullPath}`;
    } catch (error) {
        return `❌ Failed to delete file: ${error.message}`;
    }
}

async function createDirectory({ dirpath }) {
    const fullPath = path.resolve(dirpath);
    try {
        await fs.mkdir(fullPath, { recursive: true });
        return `📁 Directory created successfully: ${fullPath}`;
    } catch (error) {
        return `❌ Failed to create directory: ${error.message}`;
    }
}

async function getFileInfo({ filepath }) {
    const fullPath = path.resolve(filepath);
    try {
        const stats = await fs.stat(fullPath);
        const info = {
            size: `${(stats.size / 1024).toFixed(2)} KB`,
            created: stats.birthtime.toLocaleString(),
            modified: stats.mtime.toLocaleString(),
            isDirectory: stats.isDirectory(),
            isFile: stats.isFile()
        };
        return `📊 File info for ${filepath}:\n${JSON.stringify(info, null, 2)}`;
    } catch (error) {
        return `❌ Could not get file info: ${error.message}`;
    }
}

export const fileTools = {
    writeFile,
    readFile,
    listDirectory,
    deleteFile,
    createDirectory,
    getFileInfo
};
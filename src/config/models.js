// AI Model Configuration
export let currentModel = 'gpt-4o-mini'; // Default model

export const availableModels = {
    'gpt-4o-mini': {
        name: 'GPT-4o Mini',
        provider: 'OpenAI',
        icon: '🤖',
        description: 'Fast and efficient OpenAI model'
    },
    'gemini-2.5-flash': {
        name: 'Gemini 2.5 Flash',
        provider: 'Google',
        icon: '✨',
        description: 'Google\'s latest model'
    }
};

export function setCurrentModel(model) {
    currentModel = model;
}

export function getCurrentModel() {
    return currentModel;
}

export function getModelInfo(model = currentModel) {
    return availableModels[model];
}
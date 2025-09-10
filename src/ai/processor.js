import { openaiClient, geminiClient } from './clients.js';
import { getCurrentModel } from '../config/models.js';

export async function callAI(messages) {
    const currentModel = getCurrentModel();
    
    if (currentModel === 'gpt-4o-mini') {
        return await callOpenAI(messages);
    } else if (currentModel === 'gemini-2.5-flash') {
        return await callGemini(messages);
    } else {
        throw new Error(`Unsupported model: ${currentModel}`);
    }
}

async function callOpenAI(messages) {
    const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: 'json_object' },
        messages: messages,
    });

    return response.choices[0].message.content;
}

async function callGemini(messages) {
    const model = geminiClient.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    // Combine system and user messages for Gemini
    const systemMsg = messages.find(m => m.role === 'system');
    const userMsg = messages.find(m => m.role === 'user');

    const prompt = systemMsg ? `${systemMsg.content}\n\nUser Query: ${userMsg.content}` : userMsg.content;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
}
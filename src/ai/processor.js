import { openaiClient, geminiClient } from './clients.js';
import { getCurrentModel } from '../config/models.js';

export async function callAI(messages) {
    const currentModel = getCurrentModel();

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('AI request timed out after 30 seconds')), 30000);
    });

    try {
        if (currentModel === 'gpt-4o-mini') {
            return await Promise.race([callOpenAI(messages), timeoutPromise]);
        } else if (currentModel === 'gemini-2.5-flash') {
            return await Promise.race([callGemini(messages), timeoutPromise]);
        } else {
            throw new Error(`Unsupported model: ${currentModel}`);
        }
    } catch (error) {
        console.error('AI Call Error:', error);
        throw error;
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
    try {
        const model = geminiClient.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Convert OpenAI format to Gemini format
        const geminiMessages = [];
        let systemPrompt = '';

        for (const message of messages) {
            if (message.role === 'system') {
                systemPrompt = message.content;
            } else if (message.role === 'user') {
                geminiMessages.push({
                    role: 'user',
                    parts: [{ text: message.content }]
                });
            } else if (message.role === 'assistant') {
                geminiMessages.push({
                    role: 'model',
                    parts: [{ text: message.content }]
                });
            }
        }

        // If this is the first message, include system prompt
        if (geminiMessages.length === 1 && systemPrompt) {
            geminiMessages[0].parts[0].text = `${systemPrompt}\n\nUser Query: ${geminiMessages[0].parts[0].text}`;
        }

        // For conversation history, use a simpler approach
        if (geminiMessages.length === 1) {
            // First message - direct generation
            const result = await model.generateContent(geminiMessages[0].parts[0].text);
            return result.response.text();
        } else {
            // Conversation - use chat
            const chat = model.startChat({
                history: geminiMessages.slice(0, -1),
            });

            const lastMessage = geminiMessages[geminiMessages.length - 1];
            const result = await chat.sendMessage(lastMessage.parts[0].text);
            return result.response.text();
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error(`Gemini API failed: ${error.message}`);
    }
}
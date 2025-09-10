import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const openaiapikey = process.env.OPEN_AI_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

export const openaiClient = new OpenAI({ apiKey: openaiapikey });
export const geminiClient = new GoogleGenerativeAI(geminiApiKey);
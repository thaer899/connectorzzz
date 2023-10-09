require('dotenv').config();
const OpenAI = require('openai');
const { optimizeData } = require('./chatbotLogic');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing!");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function createOpenAICompletion(messages, options = {}) {
    const defaultOptions = {
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        max_tokens: 50,
        ...options,
    };

    return await openai.chat.completions.create({
        messages,
        ...defaultOptions,
    });
}

module.exports = {
    createOpenAICompletion,
};

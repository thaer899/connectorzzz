require('dotenv').config();
const OpenAI = require('openai');
const { optimizeData } = require('./chatbotLogic');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const threadId = process.env.globalThreadId;

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
    console.log("Sending to OpenAI:", messages);
    return await openai.chat.completions.create({
        messages,
        ...defaultOptions,
    });
}



async function createOpenAIAssistantCompletion(userMessage, options = {}) {
    const openai = new OpenAI(OPENAI_API_KEY);
    const assistantId = 'asst_dLiCZT8Uaj3K1ucwTm12Jtga'; // Your assistant ID
    try {
        // Send the user's message to the assistant
        const messageResponse = await openai.createMessage(threadId, {
            input: {
                assistant_id: assistantId,
                message_type: 'text',
                content: userMessage
            }
        });

        // Retrieve the assistant's response
        const assistantMessage = messageResponse.data.choices[0].message.content;
        console.log(assistantMessage);
        return assistantMessage;
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Error processing the request.");
    }
}


module.exports = {
    createOpenAICompletion,
    createOpenAIAssistantCompletion
};

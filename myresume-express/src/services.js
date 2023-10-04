require('dotenv').config();
const API_KEY = process.env.API_KEY;


const axios = require('axios');
const { getResume, optimizeData } = require('./data');
const { createOpenAICompletion } = require('./openai');
const MAX_TOKENS = 20000;


async function getOpenAIMessage(email, recipientMessage = '') {
    console.time('getOpenAIMessage'); // Start Function Timer

    const data = await getResume(email);
    console.log('Data Size:', Buffer.from(JSON.stringify(data)).length, 'bytes'); // Log Data Size

    console.log('Getting OpenAI message with recipient message:', recipientMessage);
    const messages = await optimizeData(data, 'messages', recipientMessage);

    const response = await createOpenAICompletion(messages);

    console.timeEnd('getOpenAIMessage'); // End Function Timer
    return response;
}

async function getOpenAISkill(email, recipientMessage = '') {
    console.time('getOpenAISkill'); // Start Function Timer
    const data = await getResume(email);
    console.log('Data Size:', Buffer.from(JSON.stringify(data)).length, 'bytes'); // Log Data Size
    const messages = await optimizeData(data, 'skills', recipientMessage);
    console.log("mappedData: ", JSON.stringify(messages, null, 2));
    const customOptions = {
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        max_tokens: 150
    };

    const response = await createOpenAICompletion(messages, customOptions);


    return response;
}

async function getOpenAIQuote(email) {
    console.log('Getting OpenAI quote for:', email);
    const data = await getResume(email);
    const messages = await optimizeData(data, 'quotes');
    const response = await createOpenAICompletion(messages);

    return response;
}


async function getOpenAICompletion(recipientMessage, email = null) {
    let response = null;
    if (!recipientMessage) {
        throw new Error('Missing required parameter: recipientMessage');
    }

    if (email) {
        const data = await getResume(email);
        response = await createOpenAICompletion(recipientMessage.messages, recipientMessage.options, data);
    }
    else {
        response = await createOpenAICompletion(recipientMessage.messages, recipientMessage.options);
    }
    return response;
}


async function getOpenAIByTopic(recipientMessage, topic = null, email = null) {
    let response = null;
    if (!recipientMessage) {
        throw new Error('Missing required parameter: recipientMessage');
    }

    if (email) {
        const data = await getResume(email);
        const messages = await optimizeData(data, topic, recipientMessage, topic)
        response = await createOpenAICompletion(messages, recipientMessage.options);
    }
    else {
        response = await createOpenAICompletion(recipientMessage.messages, recipientMessage.options);
    }
    return response;
}

function validateApiKey(req, res, next) {
    const apiKeyHeader = req.header('API_KEY');
    if (!apiKeyHeader || apiKeyHeader !== API_KEY) {
        return res.status(401).send('Invalid API Key');
    }
    next();
}

module.exports = {
    getOpenAIMessage,
    getOpenAIQuote,
    getOpenAISkill,
    validateApiKey,
    getOpenAICompletion,
    getOpenAIByTopic
};

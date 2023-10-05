require('dotenv').config();
const API_KEY = process.env.API_KEY;


const axios = require('axios');
const { getFile, optimizeData } = require('./data');
const { createOpenAICompletion } = require('./openai');
const MAX_TOKENS = 20000;


async function getOpenAIMessage(email, recipientMessage = '') {
    const data = await getFile(email);
    const messages = await optimizeData(data, 'messages', recipientMessage, 'messages');
    console.log('Messages:', messages);
    const customOptions = {
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        max_tokens: 150
    };
    const response = await createOpenAICompletion(messages, customOptions);
    console.log('Response:', JSON.stringify(response.choices[0].message));
    return response;
}



async function getOpenAISkill(email, recipientMessage = '') {
    console.time('getOpenAISkill'); // Start Function Timer
    const data = await getFile(email);
    console.log('Data Size:', Buffer.from(JSON.stringify(data)).length, 'bytes'); // Log Data Size
    const messages = await optimizeData(data, 'skills', recipientMessage);
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
    const data = await getFile(email);
    const messages = await optimizeData(data, 'quotes');
    const response = await createOpenAICompletion(messages);
    return response;
}


async function getOpenAICompletion(recipientMessage, templateType, email) {
    let response = {};
    if (!recipientMessage) {
        throw new Error('Missing required parameter: recipientMessage');
    }
    console.log("getOpenAICompletion:", recipientMessage, templateType, email);
    console.log("email:", email)
    if (email) {
        const data = await getFile(email);
        const messages = await optimizeData(data, templateType, recipientMessage)
        console.log("getOpenAICompletion Messages:", messages);
        response = await createOpenAICompletion(messages, recipientMessage.options);
        console.log("createOpenAICompletion Response:", email, response);
    }
    else {
        response = await createOpenAICompletion(recipientMessage.messages, recipientMessage.options);
        console.log("Response:", response);
    }
    return response;
}


async function getOpenAIByTopic(recipientMessage, templateType = null, email = null) {
    let response = null;
    if (!recipientMessage) {
        throw new Error('Missing required parameter: recipientMessage');
    }

    if (email) {
        const data = await getFile(email);
        const messages = await optimizeData(data, templateType, recipientMessage)
        response = await createOpenAICompletion(templateType, messages, recipientMessage.options, data);
    }
    else {
        response = await createOpenAICompletion(templateType, recipientMessage.messages, recipientMessage.options);
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

require('dotenv').config();
const API_KEY = process.env.API_KEY;
const axios = require('axios');
const { getFile } = require('../services/api/apiCommunications');
const { optimizeData } = require('../services/chatbot/chatbotLogic');
const { createOpenAICompletion } = require('../services/chatbot/openai');

async function getOpenAIMessage(email, recipientMessage) {
    console.log(
        'getOpenAICompletion | RecipientMessage Preview:',
        (typeof recipientMessage === 'string' ? recipientMessage : JSON.stringify(recipientMessage)).substring(0, 100),
        '| Email:', email
    );
    console.log('########### getOpenAIMessage recipientMessage:', recipientMessage);
    const data = await getFile(email);
    const messages = await optimizeData(data, recipientMessage, 'messages',);
    console.log('########### getOpenAICompletion optimized Data Messages Preview:', typeof messages === 'string' ? messages.substring(0, 100) : JSON.stringify(messages).substring(0, 100));
    const customOptions = {
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        max_tokens: 150
    };
    const response = await createOpenAICompletion(messages, customOptions);
    console.log('########### createOpenAICompletion Response Preview:', typeof response === 'string' ? response.substring(0, 100) : JSON.stringify(response).substring(0, 100));
    return response;
}

async function getOpenAISkill(email, recipientMessage = '') {
    const data = await getFile(email);
    console.log('########### Data Size:', Buffer.from(JSON.stringify(data)).length, 'bytes');
    const messages = await optimizeData(data, recipientMessage, 'skills');
    const customOptions = {
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        max_tokens: 150
    };
    const response = await createOpenAICompletion(messages, customOptions);
    return response;
}

async function getOpenAIQuote(email) {
    console.log('########### getOpenAIQuote | Email:', email);
    const data = await getFile(email);
    const messages = await optimizeData(data, '', 'quotes');
    const response = await createOpenAICompletion(messages);
    return response;
}

async function getOpenAICompletion(recipientMessage, templateType, email) {
    console.log(
        'getOpenAICompletion | RecipientMessage Preview:',
        (typeof recipientMessage === 'string' ? recipientMessage : JSON.stringify(recipientMessage)).substring(0, 100),
        '| TemplateType:', templateType,
        '| Email:', email
    );

    let response = {};
    if (!recipientMessage) {
        throw new Error('Missing required parameter: recipientMessage');
    }

    if (email) {
        const data = await getFile(email);
        console.log('########### recipientMessage before optimizeData: ', recipientMessage);
        const messages = await optimizeData(data, recipientMessage, templateType)
        console.log("########### optimized Data Messages Preview | email:", JSON.stringify(messages).substring(0, 100), email);
        response = await createOpenAICompletion(messages, recipientMessage.options);
        console.log("########### created OpenAICompletion Response Preview:", JSON.stringify(response).substring(0, 100));
    } else {
        response = await createOpenAICompletion(recipientMessage.messages, recipientMessage.options);
        console.log("########### created OpenAICompletion Response Preview:", JSON.stringify(response).substring(0, 100));
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
    getOpenAICompletion
};

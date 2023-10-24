require('dotenv').config();
const API_KEY = process.env.API_KEY;
const axios = require('axios');
const { getFile, searchImages, uploadFile } = require('../services/api/apiCommunications');
const { optimizeData } = require('../services/chatbot/chatbotLogic');
const { createOpenAICompletion } = require('../services/chatbot/openai');
const { createLlamaCompletion } = require('../services/chatbot/llamaLogic');

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


async function createBlogPost(email, recipientMessage) {
    try {
        const data = await getFile(email);
        if (!data) throw new Error('Data not found');

        const tags = parseTags(recipientMessage);
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;


        const template = [
            {
                role: "user",
                content: `Create a new blog post the user message with the following format:{ "draft": "true", "title": "", "url": "empty", "description": "", "posts": [{ "title": "", "url": "empty",  "date": "${formattedDate}", "summary": "", "tags": [] }] }`
            },
            {
                role: "assistant",
                content: "Keep urls empty and summarize 100 words."
            }
        ];

        const messages = await optimizeData(data, tags, 'blog');

        if (!Array.isArray(messages)) {
            throw new Error('Messages is not an array');
        }

        messages.unshift(...template);


        const customOptions = {
            model: 'gpt-3.5-turbo',
            temperature: 0.2,
            max_tokens: 500
        };

        const response = await createOpenAICompletion(messages, customOptions);


        if (!response?.choices || !response?.choices[0] || !response.choices[0].message) {
            throw new Error('Invalid response from OpenAI');
        }
        const contentObject = JSON.parse(response.choices[0].message.content);
        const title = contentObject.title;
        console.log('########### Title:', title);

        const imageUrls = await searchImages(title);
        console.log('########### imageUrls:', imageUrls);
        // Set blog url
        contentObject.url = imageUrls[0] || '';  // Assuming the first image URL is for the blog

        // Set post urls
        contentObject.posts.forEach((post, index) => {
            post.url = imageUrls[index + 1] || '';  // Start from the second image URL for the posts
        });

        const defaultData = await getFile(email);
        const blog = contentObject;
        defaultData.blog.unshift(blog);
        console.log('########### Updated data:', JSON.stringify(defaultData.blog).substring(0, 200));
        email = email.replace(/"/g, '');
        console.log('########### defaultData bots:', defaultData.bots);
        await uploadFile(email, defaultData);

        return blog;
    } catch (error) {
        console.error('Error in createBlogPost:', error.message);
        throw error;  // Re-throw the error after logging it, so it can be handled by the calling function
    }
}


function getLlamaResponse(input) {
    return createLlamaCompletion(input);
}


function parseTags(input) {
    return input.split(',').map(tag => tag.trim());
}


function validateApiKey(req, res, next) {
    const apiKeyHeader = req.header('apiKey');
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
    createBlogPost,
    getLlamaResponse
};

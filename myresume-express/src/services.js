require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_KEY = process.env.API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const MAX_TOKENS = 20000;
const admin = require('firebase-admin');
const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH;
const serviceAccount = require(serviceAccountPath);

const axios = require('axios');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "site-generator-ng.appspot.com"
});

const storage = admin.storage().bucket();

async function getDownloadUrl(email) {
    email = email.replace(/"/g, '');
    const file = storage.file(`${email}.json`);
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    });
    return url;
}

async function getResume(email) {
    const downloadURL = await getDownloadUrl(email);
    const response = await axios.get(downloadURL);
    if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
    }
    return response.data;
}


async function getOpenAIMessage(email, recipentMessage = '') {
    const data = await getResume(email);
    const messages = await optimizeData(data, 'message', recipentMessage);

    return openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
    });
}

// Placeholder for the new quote function
async function getOpenAIQuote(email) {
    const data = await getResume(email);
    const messages = await optimizeData(data, 'quote');

    return openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
    });
}

async function optimizeData(data, templateType, recipentMessage = '') {
    let templateData;
    if (templateType === 'message') {
        templateData = await getDataFromFile('../data/messages.json');
        // Additional message-specific logic can be added here...
    } else if (templateType === 'quote') {
        templateData = await getDataFromFile('../data/quotes.json');
        // Additional quote-specific logic can be added here...
    } else {
        throw new Error('Invalid template type specified.');
    }

    const { education, employment, references, skills, interests, personal, resume, languages } = data;

    let resumeSummary = templateData.summary
        .replace('{education}', JSON.stringify(education))
        .replace('{employment}', JSON.stringify(employment))
        .replace('{references}', JSON.stringify(references))
        .replace('{skills}', JSON.stringify(skills))
        .replace('{interests}', JSON.stringify(interests))
        .replace('{personal}', JSON.stringify(personal))
        .replace('{resume}', JSON.stringify(resume))
        .replace('{languages}', JSON.stringify(languages));

    templateData.messages.forEach(message => {
        message.content = message.content
            .replace('{resumeSummary}', resumeSummary)
            .replace('{recipentMessage}', recipentMessage);
    });

    // Check token count (simplified version)
    let tokenCount = JSON.stringify(templateData).length;
    console.log("Token count:", tokenCount);

    if (tokenCount > MAX_TOKENS) {
        const assistantMessage = templateData.messages.find(msg => msg.role === 'assistant');
        assistantMessage.content = "My response is too long. Can you specify the area you're interested in?";
    }

    return templateData.messages;
}



async function getDataFromFile(filePath) {
    const data = await fs.readFile(path.join(__dirname, filePath), 'utf8');
    return JSON.parse(data);
}

function validateApiKey(req, res, next) {
    const apiKeyHeader = req.header('API_KEY');
    if (!apiKeyHeader || apiKeyHeader !== API_KEY) {
        return res.status(401).send('Invalid API Key');
    }
    next();
}

module.exports = {
    getResume,
    getOpenAIMessage,
    validateApiKey,
    getOpenAIQuote
};

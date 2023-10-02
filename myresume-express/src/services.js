require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const API_KEY = process.env.API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const MAX_TOKENS = 20000;
const admin = require('firebase-admin');
const serviceAccount = require('../secret/site-generator-ng-firebase.json');
const axios = require('axios');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "site-generator-ng.appspot.com"
});


const storage = admin.storage().bucket();


async function getDownloadUrl(email) {
    email = email.replace(/"/g, '');
    const file = storage.file(`${email}.json`);
    console.log("file: ", `${email}.json`);
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    });
    return url;
}

async function getOpenAIResponse(email, recipentMessage) {
    const data = await getResume(email);

    const messages = await optimizeData(data, recipentMessage);
    console.log("messages: ", messages);
    return openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
    });
}

async function optimizeData(data, recipentMessage) {
    const messageTemplate = await getMessages();
    const { education, employment, references, skills, interests, personal, resume, languages } = data;

    let resumeSummary = messageTemplate.summary
        .replace('{education}', JSON.stringify(education))
        .replace('{employment}', JSON.stringify(employment))
        .replace('{references}', JSON.stringify(references))
        .replace('{skills}', JSON.stringify(skills))
        .replace('{interests}', JSON.stringify(interests))
        .replace('{personal}', JSON.stringify(personal))
        .replace('{resume}', JSON.stringify(resume))
        .replace('{languages}', JSON.stringify(languages));


    messageTemplate.messages.forEach(message => {
        message.content = message.content
            .replace('{resumeSummary}', resumeSummary)
            .replace('{recipentMessage}', recipentMessage);
    });


    // Check token count (simplified version)
    let tokenCount = JSON.stringify(messageTemplate).length;
    console.log("Token count:", tokenCount);

    if (tokenCount > MAX_TOKENS) {
        const assistantMessage = messageTemplate.messages.find(msg => msg.role === 'assistant');
        assistantMessage.content = "I have a detailed resume. Please specify the area you're interested in.";
    }

    return messageTemplate.messages;
}

async function getResume(email) {
    try {
        const downloadURL = await getDownloadUrl(email);
        console.log("downloadURL: ", downloadURL);

        const response = await axios.get(downloadURL);

        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // The request was made and the server responded with a 404 status code (Not Found)
            throw { status: 404, message: 'Resume not found for the provided email.' };
        } else if (error.response) {
            console.error("Error fetching resume. Server responded with status:", error.response.status);
            throw { status: error.response.status, message: 'Error fetching resume from storage.' };
        } else if (error.request) {
            console.error("Error fetching resume. No response received:", error.request);
            throw { status: 500, message: 'No response received from storage.' };
        } else {
            console.error("Error fetching resume:", error.message);
            throw { status: 500, message: error.message };
        }
    }
}




async function getMessages() {
    const datafilePath = path.join(__dirname, '../data/messages.json');
    const data = await fs.readFile(datafilePath, 'utf8');
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
    getOpenAIResponse,
    validateApiKey
};

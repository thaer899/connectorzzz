require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const admin = require('firebase-admin');
const axios = require('axios');

const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);
const data = {
    recipientMessage: 'Hello, John!'
};

const templateSummary = '{ "role": "user", "content": "{recipientMessage}" }';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "site-generator-ng.appspot.com"
});

const storage = admin.storage().bucket();
const MAX_TOKENS = 20000;


async function optimizeData(data, templateType, recipientMessage = '', topic = null) {
    console.log('Optimizing data for template type:', templateType, 'and topic:', topic);
    templateType = templateType.replace(/"/g, '');
    const filePath = path.join(__dirname, '..', 'data', `${templateType}.json`);
    const templateData = await getDataFromFile(filePath);

    const resumeSummary = topic ?
        createResumeSummaryForTopic(data, topic) :
        createResumeSummaryForTemplate(data, templateData.summary);

    console.log("TEST! ", createResumeSummaryForTemplate(data, templateSummary));

    updateMessageContent(templateData, resumeSummary, recipientMessage);
    handleTokenCount(templateData);

    console.log('Template data:', templateData);
    return templateData.messages;
}

function createResumeSummaryForTopic(data, topic) {
    const mappedData = {};

    if (!data[topic]) return JSON.stringify(mappedData);

    data[topic].forEach(topicCategory => {
        topicCategory.list.forEach(topicItem => {
            mappedData[topicItem] = [];
        });
    });

    if (topic === 'skills') {
        addAttributes(mappedData, data.employment, 'technologies', 'title');
    }

    return JSON.stringify(mappedData);
}



function createResumeSummaryForTemplate(data, templateSummary) {
    console.log("TEST! ", templateSummary);
    console.log("TEST! ", JSON.stringify(data));
    return Object.keys(data).reduce(
        (summary, key) => summary.replace(`{${key}}`, JSON.stringify(data[key])),
        templateSummary
    );
}



function addAttributes(mappedData, items, attributeName, propertyToPush) {
    items.forEach(item => {
        item[attributeName].forEach(attribute => {
            if (mappedData[attribute]) {
                mappedData[attribute].push({
                    [propertyToPush]: item[propertyToPush],
                });
            }
        });
    });
}


function updateMessageContent(templateData, resumeSummary, recipientMessage) {
    templateData.messages.forEach(message => {
        message.content = message.content
            .replace('{resumeSummary}', resumeSummary)
            .replace('{recipientMessage}', JSON.stringify(recipientMessage));
    });
}

function handleTokenCount(templateData) {
    const tokenCount = JSON.stringify(templateData).length;
    console.log("Token count:", tokenCount);

    if (tokenCount > MAX_TOKENS) {
        const assistantMessage = templateData.messages.find(msg => msg.role === 'assistant');
        assistantMessage.content = "My response is too long. Can you specify the area you're interested in?";
    }
}

async function getDownloadUrl(email) {
    try {
        console.log('Getting download URL for:', email);
        email = email.replace(/"/g, '');
        const file = storage.file(`${email}.json`);
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires
        });
        return url;
    } catch (error) {
        console.error("Error getting download URL:", error.message);
        throw error;
    }
}
async function getResume(email) {
    try {
        console.log('Retrieving resume for:', email);
        const downloadURL = await getDownloadUrl(email);
        const response = await axios.get(downloadURL);
        console.log('HTTP response status for resume retrieval:', response.status);
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error("Error getting resume data:", error.message);
        throw error;
    }
}

async function getDataFromFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error.message);
        throw error;
    }
}


module.exports = {
    getDataFromFile,
    optimizeData,
    getResume,
    getDownloadUrl
};

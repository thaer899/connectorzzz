require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const admin = require('firebase-admin');
const axios = require('axios');

const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "site-generator-ng.appspot.com"
});

const storage = admin.storage().bucket();
const MAX_TOKENS = 20000;


async function optimizeData(data, recipientMessage, templateType = 'default') {
    console.log('Optimizing data for template type:', templateType, 'Data Preview:', JSON.stringify(data).substring(0, 100));
    if (templateType !== '' && templateType !== null) {
        templateType = templateType.replace(/"/g, '');
        console.log('recipientMessage: ', recipientMessage);
        let templateData = data.bots[0].templateTypes.find(type => type.type === templateType);
        console.log('templateData: ', templateData);
        let resumeSummaryUpdated = createResumeSummaryForTemplate(data, templateData.summary);
        console.log('resumeSummaryUpdated: ', resumeSummaryUpdated);
        let replacements = { recipientMessage: recipientMessage, resumeSummary: resumeSummaryUpdated };

        let templateDataUpdated = replacePlaceholdersInMessages(templateData, replacements);
        console.log('messages to send: ', templateDataUpdated);

        return templateDataUpdated;
    }
}



function createResumeSummaryForTemplate(data, templateSummary) {
    console.log('Creating resume summary, Data Preview:', JSON.stringify(data).substring(0, 100));

    const summary = Object.keys(data).reduce((acc, key) => {
        const placeholder = `{${key}}`;

        if (!acc.includes(placeholder)) {
            console.log(`Warning: placeholder ${placeholder} not found in templateSummary.`);
            return acc;
        }

        return acc.replace(placeholder, JSON.stringify(data[key]));
    }, templateSummary);

    return summary;
}


function replacePlaceholdersInMessages(messages, replacements) {
    console.log('Creating messages with replacements:', JSON.stringify(replacements).substring(0, 100));
    console.log('replacePlaceholdersInMessages messages: ', messages.messages);
    console.log('replacePlaceholdersInMessages replacements: ', replacements);
    return messages.messages.map(message => {
        let updatedContent = message.content;
        Object.keys(replacements).forEach(key => {
            const placeholder = `{${key}}`;
            if (updatedContent.includes(placeholder)) {
                updatedContent = updatedContent.replace(placeholder, JSON.stringify(replacements[key]));
            }
        });
        return {
            ...message,
            content: updatedContent
        };
    });
}


function replacePlaceholdersInData(data, replacements) {
    console.log('Replacing placeholders in data:', JSON.stringify(replacements).substring(0, 100));
    // if data is type object then iterate over keys
    if (typeof data === 'object') {
        const summary = Object.keys(data).reduce((acc, key) => {
            const placeholder = `{${key}}`;

            if (!acc.includes(placeholder)) {
                console.log(`Warning: placeholder ${placeholder} not found in templateSummary.`);
                return acc;
            }

            return acc.replace(placeholder, JSON.stringify(data[key]));
        }, JSON.stringify(replacements));

        return summary;
    }
    else if (typeof data === 'array') {
        return messages.map(message => {
            let updatedContent = message.content;
            Object.keys(replacements).forEach(key => {
                const placeholder = `{${key}}`;
                if (updatedContent.includes(placeholder)) {
                    updatedContent = updatedContent.replace(placeholder, JSON.stringify(replacements[key]));
                }
            });
            return {
                ...message,
                content: updatedContent
            };
        });
    }
}



function handleTokenCount(templateData) {
    const tokenCount = JSON.stringify(templateData).length;
    console.log("Token count:", tokenCount, 'Template Data Preview:', JSON.stringify(templateData).substring(0, 100));

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
async function getFile(name) {
    try {
        console.log('Retrieving resume for:', name);
        const downloadURL = await getDownloadUrl(name);
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
    getFile,
    getDownloadUrl
};

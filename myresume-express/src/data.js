require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const admin = require('firebase-admin');
const axios = require('axios');
const nlp = require('compromise');
const Fuse = require('fuse.js')



const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "site-generator-ng.appspot.com"
});

const storage = admin.storage().bucket();
const MAX_TOKENS = 20000;


async function optimizeData(data, recipientMessage, templateType = 'default') {
    console.log('########### Optimizing data for template type:', templateType, 'Data Preview:', JSON.stringify(data).substring(0, 100));

    try {

        if (templateType !== '' && templateType !== null) {
            templateType = templateType.replace(/"/g, '');
            console.log('########### recipientMessage: ', recipientMessage);
            let templateData = data.bots.find(type => type.type === templateType);
            console.log('########### templateData: ', templateType, JSON.stringify(templateData).substring(0, 100));
            // get topics from summary
            // const topics = getTopics(JSON.stringify(templateData.summary))
            // // get keywords from data
            // const response = await axios.post('http://localhost:3000/extract_keywords', {
            //     text: recipientMessage + ',' + topics,
            //     data: data
            // });

            // if (!response.status === 200) {
            //     throw new Error('Failed to extract keywords');
            // }
            // let DataFromkeywords = response.data;
            // console.log('DataFromkeywords:', DataFromkeywords);

            // const placeholders = getTopics(JSON.stringify(templateData.summary));
            // getSummaryData(data, placeholders)


            let resumeSummaryUpdated = createResumeSummaryForTemplate(data, templateData.summary);
            let enhancedMessages = getEnhancedMessages(templateData, recipientMessage, resumeSummaryUpdated);
            handleTokenCount(enhancedMessages);
            return enhancedMessages;
        }
    } catch (error) {
        console.error('Error during data optimization:', error.message);
    }
}


function getSummaryData(data, query) {
    // Get all keys from data
    const keys = getAllKeys(data);

    console.log('########### keys: ', keys);
    const options = {
        includeScore: true,
        includeMatches: true,

        keys: keys
    };

    const fuse = new Fuse([data], options); // Ensure data is an array

    const result = fuse.search(query);
    console.log('########### fuse result: ', result[0].matches);
}


function getAllKeys(obj, parentKey = '', keys = []) {
    for (const key in obj) {
        let newKey = `${parentKey}${key}`;

        // If value is an array, regardless of its content
        if (Array.isArray(obj[key])) {
            // If the array contains objects
            if (typeof obj[key][0] === 'object' && obj[key][0] !== null) {
                keys = getAllKeys(obj[key][0], `${newKey}.`, keys);
            }
            // If the array contains primitive types
            else {
                keys.push(`${newKey}`);
            }
        }
        // If value is an object (and not an array)
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = getAllKeys(obj[key], `${newKey}.`, keys);
        }
        // If value is a primitive data type (string, number, etc.)
        else {
            keys.push(newKey);
        }
    }
    return keys;
}







function getEnhancedMessages(templateData, recipientMessage, resumeSummaryUpdated) {
    templateData.messages.unshift({
        "role": "system",
        "content": "Summary: " + JSON.stringify(resumeSummaryUpdated)
    });
    templateData.messages.push({
        "role": "user",
        "content": "Message:" + JSON.stringify(recipientMessage)
    });
    console.log('########### EnhancedMessages templateData: ', JSON.stringify(templateData).substring(0, 200))
    return templateData.messages;
}



function getTopics(data) {
    const topics = data.split(',').map(topic => topic.trim());
    console.log('########### topics: ', topics);
    return topics;
}


function createResumeSummaryForTemplate(data, templateSummary) {
    console.log('########### Creating resume summary, Data Preview:',);
    const placeholders = getTopics(templateSummary);

    const summary = placeholders.reduce((acc, placeholder) => {
        if (!data.hasOwnProperty(placeholder)) {
            console.log(`Warning: placeholder ${placeholder} not found in data.`);
            return acc ? `${acc}, ${placeholder}` : placeholder;
        }
        const dataStr = typeof data[placeholder] === 'string' ? data[placeholder] : JSON.stringify(data[placeholder]);
        return acc ? `${acc}, ${dataStr}` : dataStr;
    }, "");
    console.log('########### placeholders: ', placeholders, 'Summary:', JSON.stringify(summary).substring(0, 100));

    return summary;
}


function handleTokenCount(templateData) {
    const tokenCount = JSON.stringify(templateData).length;
    console.log('########### Token count:', tokenCount, 'Template Data Preview:', JSON.stringify(templateData).substring(0, 100));

    if (tokenCount > MAX_TOKENS) {
        const assistantMessage = templateData.messages.find(msg => msg.role === 'assistant');
        assistantMessage.content = "My response is too long. Can you specify the area you're interested in?";
    }
}

async function getDownloadUrl(email) {
    try {
        console.log('########### Getting download URL for:', email);
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
        console.log('########### Retrieving resume for:', name);
        const downloadURL = await getDownloadUrl(name);
        const response = await axios.get(downloadURL);
        console.log('########### HTTP response status for resume retrieval:', response.status);
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

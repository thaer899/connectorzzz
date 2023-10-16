require('dotenv').config();
const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "site-generator-ng.appspot.com"
});

const storage = admin.storage().bucket();



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

async function uploadFile(name, data) {

  try {
    console.log('########### Uploading resume for:', name);
    const file = storage.file(`${name}.json`);
    await file.save(JSON.stringify(data));
    console.log('########### Resume uploaded successfully.');
  } catch (error) {
    console.error("Error uploading resume:", error.message);
    throw error;
  }

}

async function searchImages(query, limit = 5) {
  const endpoint = 'https://api.bing.microsoft.com/v7.0/images/search';
  const apiKey = process.env.BING_API_KEY;
  try {
    const response = await axios.get(endpoint, {
      headers: { 'Ocp-Apim-Subscription-Key': apiKey },
      params: {
        q: query,
        count: limit
      }
    });
    const imageUrls = response.data.value.map(item => item.contentUrl);
    return imageUrls;
  } catch (error) {
    console.error('Image search failed:', error);
    throw error;
  }
}

module.exports = {
  getFile,
  getDownloadUrl,
  searchImages,
  uploadFile
};
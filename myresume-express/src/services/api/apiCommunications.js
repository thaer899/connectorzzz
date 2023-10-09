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


module.exports = {
  getFile,
  getDownloadUrl
};
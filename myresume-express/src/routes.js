const express = require('express');
const router = express.Router();
const { getResumeData, getOpenAIResponse } = require('./services');

router.get('/', (req, res) => {
    res.send('thaer saidi resume chatbot');
});

router.post('/message', async (req, res) => {
    try {
        const recipentMessage = req.body.recipentMessage;
        const email = req.query.email;  // Extract email from query parameter

        if (!recipentMessage || !email) {
            return res.status(400).send('Missing required parameters.');
        }

        // You can now use the email as needed, for example:
        // const resumeData = await getResumeData(email);

        const result = await getOpenAIResponse(email, recipentMessage); // Modify this function if you want to pass the email to it
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
});

module.exports = router;
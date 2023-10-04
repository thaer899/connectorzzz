const express = require('express');
const router = express.Router();
const { getOpenAIQuote, getOpenAIMessage, getOpenAISkill, getOpenAICompletion, getOpenAIByTopic } = require('./services');

router.get('/', (req, res) => {
    res.send('thaer saidi resume chatbot');
});

router.post('/message', async (req, res) => {
    try {
        const recipientMessage = req.body.recipientMessage;
        const email = req.query.email;

        console.log("recipientMessage: ", recipientMessage);
        console.log("email: ", email);
        if (!recipientMessage || !email) {
            return res.status(400).send('Missing required parameters.');
        }

        const result = await getOpenAIMessage(email, recipientMessage);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
});

router.post('/quote', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).send('Missing required parameters.');
        }

        const result = await getOpenAIQuote(email);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
});


router.post('/skill', async (req, res) => {
    try {
        const recipientMessage = req.body.recipientMessage;
        const email = req.query.email;
        if (!recipientMessage || !email) {
            return res.status(400).send('Missing required parameters.');
        }

        const result = await getOpenAISkill(email, recipientMessage);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
});

router.post('/openai', async (req, res) => {
    try {
        const recipientMessage = req.body.recipientMessage;
        const email = req.query.email;
        const templateType = req.query.templateType;

        if (!recipientMessage) {
            return res.status(400).send('Missing required parameters.');
        }

        if (email) {
            const result = await getOpenAICompletion(recipientMessage, templateType, email);
            console.log("recipientMessage: ", recipientMessage);
            console.log(result.choices[0].message);
            res.send(result);
        } else {
            const result = await getOpenAICompletion(recipientMessage);
            console.log(result.choices[0].message);
            res.send(result);
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
});


module.exports = router;

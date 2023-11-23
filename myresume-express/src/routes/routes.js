const express = require('express');
const router = express.Router();
const { getFile } = require('../services/api/apiCommunications');
const { getOpenAIQuote, getOpenAIMessage, getOpenAISkill, getOpenAICompletion, createBlogPost, getLlamaResponse, getOpenAIAssistantMessage } = require('../controllers/apiController');

router.get('/', (req, res) => {
    res.send('thaer saidi resume chatbot');
});

// Route to handle POST requests
router.post('/thaer_ai_message', async (req, res) => {
    try {
        const recipientMessage = req.body.recipientMessage;

        console.log("recipientMessage: ", recipientMessage);
        if (!recipientMessage) {
            return res.status(400).send('Missing required parameters.');
        }

        // Call the OpenAI Assistant completion function
        const result = await getOpenAIAssistantMessage(recipientMessage);
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
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

router.post('/blog', async (req, res) => {
    try {
        const recipientMessage = req.body.recipientMessage;
        const email = req.query.email;
        if (!recipientMessage || !email) {
            return res.status(400).send('Missing required parameters.');
        }

        const result = await createBlogPost(email, recipientMessage);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
});


router.post('/llama', async (req, res) => {
    try {
        const recipientMessage = req.body.recipientMessage;
        if (!recipientMessage) {
            return res.status(400).send('Missing required parameters.');
        }

        const result = await getLlamaResponse(recipientMessage);
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
            console.log("getOpenAICompletion: recipientMessage | result: ", recipientMessage, result);
            res.send(result);
        } else {
            const result = await getOpenAICompletion(recipientMessage);
            console.log("getOpenAICompletion: recipientMessage | result: ", recipientMessage, result);
            res.send(result);
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
});

router.get('/file', async (req, res) => {
    try {
        const name = req.query.name;
        if (!name) {
            return res.status(400).send('Missing required parameters.');
        }
        result = await getFile(name);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error processing the request.');
    }
});



module.exports = router;

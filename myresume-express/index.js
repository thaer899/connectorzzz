const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const OpenAI = require('openai');
const { validateApiKey } = require('./src/controllers/apiController');
const routes = require('./src/routes/routes');
const PORT = process.env.PORT || 4000;

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Global thread ID
let globalThreadId = process.env.GLOBAL_THREAD_ID;

const app = express();

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`Received a ${req.method} request to: ${req.originalUrl}`);
  next();
});

// Enable CORS for all domains
app.use(cors({ origin: '*' }));
app.options('*', cors());

// Middleware to parse JSON requests
app.use(express.json());

// Health probe endpoint
app.get('/', (req, res, next) => {
  if (req.path === '/') {
    return res.status(200).json({ message: 'OK' });
  }
  next();
});

// // Initialize global thread ID
// async function initializeGlobalThread() {
//   if (!globalThreadId) {
//     try {
//       const thread = await openai.beta.threads.create();
//       globalThreadId = thread.id;
//       console.log(`Global thread ID: ${globalThreadId}`);
//     } catch (error) {
//       console.error("Error creating global thread:", error);
//     }
//   }
// }

// // Call this function to ensure the global thread ID is initialized
// initializeGlobalThread();

// Middleware to validate API key
app.use(validateApiKey);

// Use your routes with the global thread ID
app.use('/myresume/', (req, res, next) => {
  // req.globalThreadId = globalThreadId;
  next();
}, routes);

// Handle not found errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle other errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports.handler = serverless(app);

// Start server only when not using serverless
if (!process.env.IS_SERVERLESS) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

const express = require('express');
const cors = require('cors');
const app = express();
const serverless = require('serverless-http');
const { validateApiKey } = require('./src/controllers/apiController');
const routes = require('./src/routes/routes');
const PORT = process.env.PORT || 4000;

// Enable CORS for a specific domain
// app.use(cors({
//   origin: '*'
// }));

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to validate API key
//app.use(validateApiKey);

// Use your routes
app.use('/', routes);

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

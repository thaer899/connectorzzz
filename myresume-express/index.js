const express = require('express');
const cors = require('cors');
const app = express();
const serverless = require('serverless-http');
const { validateApiKey } = require('./src/controllers/apiController');
const routes = require('./src/routes/routes');
const PORT = process.env.PORT || 4000;


// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`Received a ${req.method} request to: ${req.originalUrl}`);
  next();
});


// Enable CORS for a specific domain
app.use(cors({
  origin: '*'
}));

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

// Middleware to validate API key
app.use(validateApiKey);

// Use your routes
app.use('/myresume/', routes);

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

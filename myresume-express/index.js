const express = require('express');
const app = express();
const serverless = require('serverless-http');
const { validateApiKey } = require('./src/services');
const routes = require('./src/routes');
const PORT = process.env.PORT || 4000

app.use(express.json());
app.use('/', routes);
app.use(validateApiKey);

module.exports.handler = serverless(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

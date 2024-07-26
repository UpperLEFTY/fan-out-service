const axios = require('axios');
const winston = require('winston');

// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// Function to call a downstream service
async function callService(url, data) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    logger.error(`Error calling service at ${url}:`, error.message);
    return { error: error.message };
  }
}

module.exports = { callService };
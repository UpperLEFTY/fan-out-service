const axios = require('axios');
const winston = require('winston');

// Set up logger

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'serviceCaller' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'serviceCaller.log' })
  ]
}); 

// Function to call downstream services

async function callService(url, data) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    logger.error(`Error calling service: ${url}:`, error.message);
    return { error: error.message }; 
  }
}

module.exports = { callService };
const axios = require('axios');
const {logger} = require('../config/logger');

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
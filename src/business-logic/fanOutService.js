require('dotenv').config();
const { callService } = require('../services/serviceCaller');
const { getAsync, setAsync } = require('../redisClient');
const winston = require('winston');
const Joi = require('joi');
const featureToggle = require('feature-toggle');
const pool = require('../dbClient');


// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// Define a schema for the input data
const dataSchema = Joi.object({
  file: Joi.string().required()
});

// Function to save responses to the database
async function saveToDatabase(data) {
  const query = 'INSERT INTO responses (data) VALUES ($1)';
  await pool.query(query, [JSON.stringify(data)]);
}

// Feature toggle for caching
const useCaching = featureToggle('useCaching', true);
const defaultOptions = {
  ttl: 1200,
  default: {}
};


// Fanout
async function fanOut(data) {
  // Validate input data
  const { error } = dataSchema.validate(data);
  if (error) {
    throw new Error(`Invalid data: ${error.details[0].message}`);
  }

  const cacheKey = JSON.stringify(data);
  if (useCaching) {
    const cachedResponse = await getAsync(cacheKey);
    if (cachedResponse) {
      logger.info('Cache hit');
      return JSON.parse(cachedResponse);
    }
  }

  const requests = services.map(service => callService(service.url, data));

  try {
    const responses = await Promise.all(requests);
    await setAsync(cacheKey, JSON.stringify(responses), 'EX', 3600); // Cache for 1 hour
    await saveToDatabase(responses);

    return responses;
  } catch (error) {
    logger.error('Error in fan-out process:', error);
    throw error;
  }
}

module.exports = { fanOut };
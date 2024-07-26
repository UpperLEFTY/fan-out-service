require('dotenv').config();
const { callService } = require('../services/serviceCaller');
const { getAsync, setAsync } = require('../redisClient');
const winston = require('winston');
const Joi = require('joi');
const featureToggle = require('feature-toggle');

// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// Downstream service URLs from envs
const imageProcessingServiceUrl = process.env.IMAGE_PROCESSING_URL;
const textExtractionServiceUrl = process.env.TEXT_EXTRACTION_URL;
const metadataGenerationServiceUrl = process.env.METADATA_GENERATION_URL;

// Define a schema for the input data
const dataSchema = Joi.object({
  file: Joi.string().required()
});

// Feature toggle for caching
const useCaching = featureToggle('useCaching', true);

// Fan-out function
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

  const requests = [
    callService(imageProcessingServiceUrl, data),
    callService(textExtractionServiceUrl, data),
    callService(metadataGenerationServiceUrl, data)
  ];

  try {
    const responses = await Promise.all(requests);

    if (useCaching) {
      await setAsync(cacheKey, JSON.stringify(responses), 'EX', 3600); // Cache for 1 hour
    }

    return responses;
  } catch (error) {
    logger.error('Error in fan-out process:', error);
    throw error;
  }
}

module.exports = { fanOut };
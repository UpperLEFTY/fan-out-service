require('dotenv').config();
const { callService } = require('../services/serviceCaller');
const { getAsync, setAsync } = require('../redisClient');
const winston = require('winston');
const Joi = require('joi');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'fanOutService' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'fanOutService.log' })
  ]
});

// Downstream service URLs
const imageProcessingServiceUrl = process.env.IMAGE_PROCESSING_SERVICE_URL;
const textExtractionServiceUrl = process.env.TEXT_EXTRACTION_SERVICE_URL;
const metadataGenerationServiceUrl = process.env.METADATA_GENERATION_SERVICE_URL;

// schema for for the input data
const dataSchema = Joi.object({
  file: Joi.string().required()
});

// Fan-out function
async function fanOut(data) {
  // validate the input data
  const { error } = dataSchema.validate(data);
  if (error) {
    throw new Error(`Invalid data: ${error.details[0].message}`);
  }

  const cacheKey = JSON.stringify(data);
  const cachedResponse = await getAsync(cacheKey);

  if (cacheResponse) {
    logger.info('Cache hit');
    return JSON.parse(cachedResponse);
  }

  const requests = [
    callService(imageProcessingServiceUrl, data),
    callService(textExtractionServiceUrl, data),
    callService(metadataGenerationServiceUrl, data)
  ];

  try {
    const responses = await Promise.allSettled(requests);
    await setAsync(cacheKey, JSON.stringify(responses), 'EX', 3600); // cache for 1 hour
    return responses;
  } catch (error) {
    logger.error('Error in fan-out process:', error);
    throw error;
  }
}
// Receives the upload request, & the distributed processing is started.
// The function aggregates response from the downstream services, handles errors and retries if necessary.
const uploadData = { file: 'path/to/uploaded/file' };
fanOut(uploadData).then(responses => {
  console.log('Fan-out responses:', responses);
});

module.exports = { fanOut };
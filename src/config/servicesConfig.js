require('dotenv').config();

module.exports = {
  services: [
    {
      name: 'imageProcessingService',
      url: process.env.IMAGE_PROCESSING_URL
    },
    {
      name: 'textExtractionService',
      url: process.env.TEXT_EXTRACTION_URL
    },
    {
      name: 'metadataGenerationService',
      url: process.env.METADATA_GENERATION_URL
    }
  ]
};
const axios = require('axios');

// Downstream service URLs
const imageProcessingServiceUrl = 'http://image-processing-service/analyze';
const textExtractionServiceUrl = 'http://text-extraction-service/extract';
const metadataGenerationServiceUrl = 'http://metadata-generation-service/generate';

// Function to call a downstream services
async function callService(url, data) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error calling service at ${url}:`, error.message);
    return { error: error.message };
  }
}

// Fan-out function starting point more features can be added here
//TODO: Implement improved error handling
// Fan-out function with improved error handling
async function fanOut(data) {
  const requests = [
    callService(imageProcessingServiceUrl, data),
    callService(textExtractionServiceUrl, data),
    callService(metadataGenerationServiceUrl, data)
  ];

  const responses = await Promise.allSettled(requests);
  const results = responses.map(response => {
    if (response.status === 'fulfilled') {
      return response.value;
    } else {
      console.error('Service call failed:', response.reason);
      return { error: response.reason };
    }
  });

  return results;
}

// Receives the upload request, & the distributed processing is started.
// The function aggregates response from the downstream services, handles errors and retries if necessary.
const uploadData = { file: 'path/to/uploaded/file' };
fanOut(uploadData).then(responses => {
  console.log('Fan-out responses:', responses);
});

module.exports = { fanOut };
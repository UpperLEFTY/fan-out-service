require('dotenv').config();

async function fanIn(data) {
  const results = await Promise.all(data.sources.map(async (source) => {
    try {
      // Fetch data from each source
      const result = await fetchDataFromSource(source);
      return { source, result, error: null };
    } catch (error) {
      // Log the error and return it
      logger.error(`Error fetching data from source ${source}:`, error);
      return { source, result: null, error: error.message };
    }
  }));

  // Aggregate the results
  const aggregatedResult = results.reduce((acc, { source, result, error }) => {
    if (error) {
      acc.errors.push({ source, error });
    } else {
      acc.data.push(result);
    }
    return acc;
  }, { data: [], errors: [] });

  // Decide how to handle partial failures
  if (aggregatedResult.errors.length > 0) {
    logger.warn('Some sources failed to provide data:', aggregatedResult.errors);
    // Optionally, you can throw an error if you want to fail the entire operation
    // throw new Error('Failed to fetch data from some sources');
  }

  return aggregatedResult;
}

async function fetchDataFromSource(source) {
  // Simulate fetching data from a source
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a random failure
      if (Math.random() > 0.8) {
        reject(new Error(`Failed to fetch data from ${source}`));
      } else {
        resolve(`Data from ${source}`);
      }
    }, 1000);
  });
}

module.exports = { fanIn };

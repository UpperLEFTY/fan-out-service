const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const services = [
  'http://image-processing-service/analyze',
  'http://text-extraction-service/extract',
  'http://metadata-generation-service/generate'

];

app.post('/fan-out', async (req, res) => {
  const data = req.body;
  const requests = services.map(url => axios.post(url, data));

  try {
    const responses = await Promise.all(requests);
    const results = responses.map(response => response.data);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
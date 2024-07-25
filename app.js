const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const fanOutRouter = require('./routes/fanOut');
app.use('/fan-out', fanOutRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
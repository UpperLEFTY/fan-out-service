const express = require('express');
const bodyParser = require('body-parser');
const { logger } = require('./config/logger');

const app = express();
const port = 3000;


// import routes
const fanoutRouterV1 = require('./routes/fanout'); // Existing route
const fanoutRouterV2 = require('./routes/v2/fanout') // New route

app.use(bodyParser.json());

app.use('/api/v1', fanoutRouterV1);
app.use('/api/v2', fanoutRouterV2);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
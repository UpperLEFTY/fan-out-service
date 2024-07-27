const express = require('express');
const bodyParser = require('body-parser');
const { logger } = require('./config/logger');

const app = express();
const port = 3000;

// import routes
const fanOutRouterV1 = require('./routes/fanout'); // Existing route
const fanOutRouterV2 = require('./routes/v2/fanout') // New route

app.use(bodyParser.json());
app.use('/fanout/v1', fanOutRouterV1);
app.use('/fanout/v2', fanOutRouterV2);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

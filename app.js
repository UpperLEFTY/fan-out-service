const express = require('express');
const bodyParser = require('body-parser');
const fanoutRouter = require('./routes/fanout');
const winston = require('winston');

const app = express();
const port = 3000;

// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

app.use(bodyParser.json());
app.use('/api', fanoutRouter);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
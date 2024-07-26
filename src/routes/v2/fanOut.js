const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { fanOut } = require('../../business-logic/fanOutService');
const winston = require('winston');

// Set up logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ||'info', // Use LOG_LEVEL environment variable
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});



// Rate limiting middleware specific to the fanout route
const fanOutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP to the fanout endpoint, please try again after 15 minutes'
});

// Endpoint to handle the fan-out request with rate limiting
router.post('/fanout', fanOutLimiter, async (req, res) => {
  try {
    const data = req.body;
    const responses = await fanOut(data);
    res.json(responses);
  } catch (error) {
    logger.error('Error processing fanout request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
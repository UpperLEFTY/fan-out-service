const winston = require('winston');
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

//Check to make sure log directory exists
const logDir = 'logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

// logs errors and keeps up 14 days 
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...args }) => {
      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '20m', // Limits each log file to 20 megabytes (Can be adjusted)
      maxFiles: '14d' // Automatically delete files older than 14 days
    })
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '20m', // Limits each log file to 20 megabytes (Can be adjusted)
      maxFiles: '14d' // Automatically delete files older than 14 days
    })
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '20m', // Limits each log file to 20 megabytes (Can be adjusted)
      maxFiles: '14d' // Automatically delete files older than 14 days
    })
  ]
});

module.exports = { logger };

required('dotenv').config();
const redis = require('redis');
const { promisify } = require('util');

//Redis client

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Promisify the Redis client methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on('error', (error) => {
  console.error('Redis client error:', error);
});

module.exports = { client, getAsync, setAsync };
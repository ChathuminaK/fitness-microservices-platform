// app.config.js - Configuration for API Gateway
require('dotenv').config();

const config = {
  port: process.env.PORT || 8080,
  serviceName: process.env.SERVICE_NAME || 'api-gateway',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Downstream service base URLs
  services: {
    user:      process.env.USER_SERVICE_URL      || 'http://localhost:3001',
    workout:   process.env.WORKOUT_SERVICE_URL   || 'http://localhost:3002',
    progress:  process.env.PROGRESS_SERVICE_URL  || 'http://localhost:3003',
    nutrition: process.env.NUTRITION_SERVICE_URL || 'http://localhost:3004',
  },
};

module.exports = config;

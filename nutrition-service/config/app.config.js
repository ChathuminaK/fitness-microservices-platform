// app.config.js - Application configuration for Nutrition Service
require('dotenv').config();

const config = {
  port: process.env.PORT || 3004,
  serviceName: process.env.SERVICE_NAME || 'nutrition-service',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;

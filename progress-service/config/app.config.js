// app.config.js - Application configuration for Progress Service
require('dotenv').config();

const config = {
  port: process.env.PORT || 3003,
  serviceName: process.env.SERVICE_NAME || 'progress-service',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;

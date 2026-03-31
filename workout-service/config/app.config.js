// app.config.js - Application configuration for Workout Service
require('dotenv').config();

const config = {
  port: process.env.PORT || 3002,
  serviceName: process.env.SERVICE_NAME || 'workout-service',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;

// app.config.js - Application configuration for User Service
require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  serviceName: process.env.SERVICE_NAME || 'user-service',
  jwtSecret: process.env.JWT_SECRET || 'fitness_default_secret',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;

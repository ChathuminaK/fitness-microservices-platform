// swagger.config.js - Swagger/OpenAPI configuration for Workout Service
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workout Service API',
      version: '1.0.0',
      description: 'Workout microservice for the Fitness Management System. Handles workout plan creation and management.',
    },
    servers: [
      { url: 'http://localhost:3002', description: 'Direct access - Workout Service' },
      { url: 'http://localhost:8080', description: 'Via API Gateway' },
    ],
    tags: [{ name: 'Workouts', description: 'Workout plan management endpoints' }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);

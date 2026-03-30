// swagger.config.js - Swagger/OpenAPI configuration for Progress Service
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Progress Service API',
      version: '1.0.0',
      description: 'Progress tracking microservice for the Fitness Management System. Tracks weight, BMI, and fitness metrics over time.',
    },
    servers: [
      { url: 'http://localhost:3003', description: 'Direct access - Progress Service' },
      { url: 'http://localhost:8085', description: 'Via API Gateway' },
    ],
    tags: [{ name: 'Progress', description: 'Fitness progress tracking endpoints' }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);

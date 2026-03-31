// swagger.config.js - Swagger/OpenAPI configuration for Nutrition Service
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nutrition Service API',
      version: '1.0.0',
      description: 'Nutrition microservice for the Fitness Management System. Manages meal plans and nutritional tracking.',
    },
    servers: [
      { url: 'http://localhost:3004', description: 'Direct access - Nutrition Service' },
      { url: 'http://localhost:8080', description: 'Via API Gateway' },
    ],
    tags: [{ name: 'Nutrition', description: 'Meal plan management endpoints' }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);

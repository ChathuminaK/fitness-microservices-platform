// swagger.config.js - Swagger/OpenAPI configuration for User Service
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'User microservice for the Fitness Management System. Handles user registration, authentication, and profile management.',
      contact: {
        name: 'Fitness Management System',
        email: 'support@fitnessms.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Direct access - User Service',
      },
      {
        url: 'http://localhost:8080',
        description: 'Via API Gateway',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management endpoints',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;

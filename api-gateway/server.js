// server.js - API Gateway Entry Point
// Routes all incoming requests to the appropriate downstream microservice.
// Client only needs to know port 8080 — never the individual service ports.

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const config = require('./config/app.config');
const logger = require('./middleware/logger.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

// ─────────────────────────────────────────────
// Core Middleware
// ─────────────────────────────────────────────
app.use(cors());
app.use(logger);

// NOTE: Do NOT apply bodyParser globally before proxy middleware.
// http-proxy-middleware needs the raw stream. Apply body-parser only on
// non-proxied routes (health, docs aggregation, etc.).

// ─────────────────────────────────────────────
// Gateway Health Check  (no proxy needed)
// ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    service: config.serviceName,
    timestamp: new Date().toISOString(),
    downstreamServices: {
      userService:      config.services.user,
      workoutService:   config.services.workout,
      progressService:  config.services.progress,
      nutritionService: config.services.nutrition,
    },
  });
});

// ─────────────────────────────────────────────
// Downstream Service Health Checker
// Pings each service and reports status
// ─────────────────────────────────────────────
app.get('/gateway/status', async (_req, res) => {
  const fetch = require('node-fetch');

  const serviceMap = [
    { name: 'user-service',      url: `${config.services.user}/health` },
    { name: 'workout-service',   url: `${config.services.workout}/health` },
    { name: 'progress-service',  url: `${config.services.progress}/health` },
    { name: 'nutrition-service', url: `${config.services.nutrition}/health` },
  ];

  const results = await Promise.all(
    serviceMap.map(async (svc) => {
      try {
        const response = await fetch(svc.url, { timeout: 3000 });
        const data = await response.json();
        return { name: svc.name, status: data.status || 'UP', url: svc.url };
      } catch {
        return { name: svc.name, status: 'DOWN', url: svc.url };
      }
    })
  );

  const allUp = results.every((r) => r.status === 'UP');

  return res.status(allUp ? 200 : 207).json({
    gateway: 'UP',
    timestamp: new Date().toISOString(),
    services: results,
  });
});

// ─────────────────────────────────────────────
// Swagger UI — Gateway-level aggregated docs
// ─────────────────────────────────────────────
const swaggerUi = require('swagger-ui-express');

// Build a combined Swagger spec that lists all services
const gatewaySwaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Fitness Management System — API Gateway',
    version: '1.0.0',
    description: `
## Fitness Management System — Microservices API Gateway

All requests are routed through this single gateway on **port 8080**.

### Route Mappings
| Gateway Path        | Downstream Service  | Port |
|---------------------|---------------------|------|
| \`/api/users\`        | User Service        | 3001 |
| \`/api/workouts\`     | Workout Service     | 3002 |
| \`/api/progress\`     | Progress Service    | 3003 |
| \`/api/nutrition\`    | Nutrition Service   | 3004 |

### Individual Service Swagger Docs
- User Service:      http://localhost:3001/api-docs
- Workout Service:   http://localhost:3002/api-docs
- Progress Service:  http://localhost:3003/api-docs
- Nutrition Service: http://localhost:3004/api-docs
    `,
  },
  servers: [
    { url: 'http://localhost:8080', description: 'API Gateway (port 8080)' },
  ],
  tags: [
    { name: 'Users',     description: 'User registration, login, and profile management' },
    { name: 'Workouts',  description: 'Workout plan creation and management' },
    { name: 'Progress',  description: 'Fitness progress tracking (weight, BMI, body fat)' },
    { name: 'Nutrition', description: 'Meal plan and nutritional tracking' },
    { name: 'Gateway',   description: 'API Gateway health and status endpoints' },
  ],
  paths: {
    // ── Gateway ──────────────────────────────────
    '/health': {
      get: {
        tags: ['Gateway'],
        summary: 'API Gateway health check',
        responses: { 200: { description: 'Gateway is running' } },
      },
    },
    '/gateway/status': {
      get: {
        tags: ['Gateway'],
        summary: 'Check health of all downstream microservices',
        responses: {
          200: { description: 'All services UP' },
          207: { description: 'One or more services DOWN' },
        },
      },
    },
    // ── Users ────────────────────────────────────
    '/api/users/register': {
      post: {
        tags: ['Users'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name:        { type: 'string', example: 'John Doe' },
                  email:       { type: 'string', example: 'john@example.com' },
                  password:    { type: 'string', example: 'password123' },
                  age:         { type: 'integer', example: 25 },
                  gender:      { type: 'string', example: 'male' },
                  fitnessGoal: { type: 'string', example: 'Lose weight' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'User registered' }, 409: { description: 'Email exists' } },
      },
    },
    '/api/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Login user and get JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email:    { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'JWT token returned' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        responses: { 200: { description: 'List of users' } },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User profile' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user profile',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name:        { type: 'string' },
                  age:         { type: 'integer' },
                  gender:      { type: 'string' },
                  fitnessGoal: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a user',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },
    // ── Workouts ──────────────────────────────────
    '/api/workouts': {
      post: {
        tags: ['Workouts'],
        summary: 'Create a workout plan',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  userId:        { type: 'string' },
                  title:         { type: 'string', example: 'Morning Strength Training' },
                  description:   { type: 'string' },
                  type:          { type: 'string', example: 'strength' },
                  duration:      { type: 'integer', example: 45 },
                  scheduledDate: { type: 'string', example: '2026-03-31' },
                  exercises: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name:        { type: 'string', example: 'Push-ups' },
                        sets:        { type: 'integer', example: 3 },
                        reps:        { type: 'integer', example: 15 },
                        restSeconds: { type: 'integer', example: 60 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Workout created' } },
      },
      get: {
        tags: ['Workouts'],
        summary: 'Get all workout plans',
        parameters: [{ in: 'query', name: 'userId', schema: { type: 'string' } }],
        responses: { 200: { description: 'List of workouts' } },
      },
    },
    '/api/workouts/{id}': {
      get: {
        tags: ['Workouts'],
        summary: 'Get workout by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Workout details' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Workouts'],
        summary: 'Update a workout plan',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Workouts'],
        summary: 'Delete a workout plan',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },
    // ── Progress ─────────────────────────────────
    '/api/progress': {
      post: {
        tags: ['Progress'],
        summary: 'Add a progress entry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  userId:          { type: 'string' },
                  weightKg:        { type: 'number', example: 72.5 },
                  heightCm:        { type: 'number', example: 175 },
                  bodyFatPercent:  { type: 'number', example: 18.5 },
                  muscleMassKg:    { type: 'number', example: 35.2 },
                  notes:           { type: 'string' },
                  recordedDate:    { type: 'string', example: '2026-03-25' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Progress entry added' } },
      },
      get: {
        tags: ['Progress'],
        summary: 'Get all progress entries',
        parameters: [{ in: 'query', name: 'userId', schema: { type: 'string' } }],
        responses: { 200: { description: 'Progress history' } },
      },
    },
    '/api/progress/{id}': {
      get: {
        tags: ['Progress'],
        summary: 'Get progress entry by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Progress entry' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Progress'],
        summary: 'Update a progress entry',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Progress'],
        summary: 'Delete a progress entry',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },
    // ── Nutrition ────────────────────────────────
    '/api/nutrition': {
      post: {
        tags: ['Nutrition'],
        summary: 'Add a meal plan',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['mealName'],
                properties: {
                  userId:        { type: 'string' },
                  mealName:      { type: 'string', example: 'Post-workout meal' },
                  mealType:      { type: 'string', example: 'post-workout' },
                  scheduledDate: { type: 'string', example: '2026-03-25' },
                  notes:         { type: 'string' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name:      { type: 'string', example: 'Chicken Breast' },
                        quantity:  { type: 'string', example: '150g' },
                        calories:  { type: 'number', example: 248 },
                        proteinG:  { type: 'number', example: 46.5 },
                        carbsG:    { type: 'number', example: 0 },
                        fatG:      { type: 'number', example: 5.4 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Meal added' } },
      },
      get: {
        tags: ['Nutrition'],
        summary: 'Get all meal plans',
        parameters: [{ in: 'query', name: 'userId', schema: { type: 'string' } }],
        responses: { 200: { description: 'List of meals' } },
      },
    },
    '/api/nutrition/{id}': {
      get: {
        tags: ['Nutrition'],
        summary: 'Get meal by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Meal details' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Nutrition'],
        summary: 'Update a meal plan',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Nutrition'],
        summary: 'Delete a meal plan',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },
  },
  components: {},
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(gatewaySwaggerSpec, {
  customSiteTitle: 'Fitness MS — API Gateway Docs',
  swaggerOptions: { docExpansion: 'list' },
}));

app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(gatewaySwaggerSpec);
});

// ─────────────────────────────────────────────
// Proxy Route Definitions
// Each block proxies a path prefix to its service.
// pathRewrite keeps the /api/xxx path intact downstream.
// ─────────────────────────────────────────────

// Common proxy options factory
const makeProxy = (target, pathPrefix) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    // Keep the full path — downstream services expect /api/users, /api/workouts etc.
    pathRewrite: (path) => path,
    on: {
      error: (err, req, res) => {
        console.error(`[API-GATEWAY] Proxy error for ${req.method} ${req.url} → ${target}:`, err.message);
        if (!res.headersSent) {
          res.status(503).json({
            success: false,
            message: `Service unavailable. Could not reach ${target}. Please ensure the microservice is running.`,
          });
        }
      },
      proxyReq: (proxyReq, req) => {
        // Add gateway header so downstream services know the request came through the gateway
        proxyReq.setHeader('X-Gateway', 'fitness-api-gateway');
        proxyReq.setHeader('X-Forwarded-From', 'api-gateway:8080');
        // Log forwarding
        console.log(`[API-GATEWAY] Forwarding ${req.method} ${req.url} → ${target}${req.url}`);
      },
    },
  });

// ── Route: /api/users  →  User Service (port 3001)
app.use('/api/users', makeProxy(config.services.user, '/api/users'));

// ── Route: /api/workouts  →  Workout Service (port 3002)
app.use('/api/workouts', makeProxy(config.services.workout, '/api/workouts'));

// ── Route: /api/progress  →  Progress Service (port 3003)
app.use('/api/progress', makeProxy(config.services.progress, '/api/progress'));

// ── Route: /api/nutrition  →  Nutrition Service (port 3004)
app.use('/api/nutrition', makeProxy(config.services.nutrition, '/api/nutrition'));

// ─────────────────────────────────────────────
// 404 — Unmatched routes
// ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found on gateway.',
    availableRoutes: [
      'GET    /health',
      'GET    /gateway/status',
      'GET    /api-docs',
      'ANY    /api/users/*',
      'ANY    /api/workouts/*',
      'ANY    /api/progress/*',
      'ANY    /api/nutrition/*',
    ],
  });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(config.port, () => {
  console.log('\n' + '═'.repeat(60));
  console.log(`  🚀  API GATEWAY — Fitness Management System`);
  console.log('═'.repeat(60));
  console.log(`  ✅  Gateway running on    http://localhost:${config.port}`);
  console.log(`  📖  Swagger (Gateway):    http://localhost:${config.port}/api-docs`);
  console.log(`  🏥  Health check:         http://localhost:${config.port}/health`);
  console.log(`  📡  Service status:       http://localhost:${config.port}/gateway/status`);
  console.log('─'.repeat(60));
  console.log('  Route Map:');
  console.log(`  /api/users      →  User Service      (${config.services.user})`);
  console.log(`  /api/workouts   →  Workout Service   (${config.services.workout})`);
  console.log(`  /api/progress   →  Progress Service  (${config.services.progress})`);
  console.log(`  /api/nutrition  →  Nutrition Service (${config.services.nutrition})`);
  console.log('═'.repeat(60) + '\n');
});

module.exports = app;

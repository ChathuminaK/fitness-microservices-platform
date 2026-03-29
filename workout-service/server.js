// server.js - Entry point for Workout Service
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/app.config');
const swaggerSpec = require('./config/swagger.config');
const workoutRoutes = require('./routes/workout.routes');

const app = express();

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`[${config.serviceName}] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ─────────────────────────────────────────────
// Swagger UI
// ─────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Workout Service API Docs',
}));
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use('/api/workouts', workoutRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', service: config.serviceName, timestamp: new Date().toISOString() });
});

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error(`[${config.serviceName}] Error:`, err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n✅ ${config.serviceName} running on port ${config.port}`);
  console.log(`📖 Swagger UI: http://localhost:${config.port}/api-docs`);
  console.log(`🏥 Health:     http://localhost:${config.port}/health\n`);
});

module.exports = app;

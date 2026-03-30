// server.js - Entry point for User Service
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/app.config');
const swaggerSpec = require('./config/swagger.config');
const userRoutes = require('./routes/user.routes');

const app = express();

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${config.serviceName}] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ─────────────────────────────────────────────
// Swagger UI
// ─────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'User Service API Docs',
}));

// Expose raw swagger JSON (useful for gateway aggregation)
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    service: config.serviceName,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(`[${config.serviceName}] Unhandled error:`, err);
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

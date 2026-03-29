// errorHandler.middleware.js - Centralised error handler for API Gateway
const errorHandler = (err, req, res, _next) => {
  console.error('[API-GATEWAY] Unhandled error:', err.message || err);

  // Handle proxy errors (downstream service unreachable)
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: 'Downstream service is unavailable. Please ensure all microservices are running.',
      error: err.code,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal gateway error.',
    error: err.message || 'Unknown error',
  });
};

module.exports = errorHandler;

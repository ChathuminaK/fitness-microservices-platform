// logger.middleware.js - Request/Response logger for API Gateway
const logger = (req, res, next) => {
  const start = Date.now();

  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const color =
      res.statusCode >= 500 ? '\x1b[31m' :  // red
      res.statusCode >= 400 ? '\x1b[33m' :  // yellow
      res.statusCode >= 300 ? '\x1b[36m' :  // cyan
      '\x1b[32m';                            // green
    const reset = '\x1b[0m';

    console.log(
      `[API-GATEWAY] ${new Date().toISOString()} ` +
      `${color}${res.statusCode}${reset} ` +
      `${req.method} ${req.originalUrl} ` +
      `→ ${duration}ms`
    );
  });

  next();
};

module.exports = logger;

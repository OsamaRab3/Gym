console.log('Server starting...');

const app = require('./app');
const http = require('http');

// Try to load config, but don't fail if it doesn't exist
let config = { PORT: process.env.PORT || 3000 };
try {
  config = { ...config, ...require('./config/environment') };
  console.log('Config loaded successfully');
} catch (error) {
  console.warn('Could not load config/environment.js, using default configuration');
  console.warn(error.message);
}

// Create HTTP server
const server = http.createServer(app);

// Error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// For Vercel deployment - wrap in try/catch to catch initialization errors
let handler;
try {
  handler = app;
  console.log('App initialized successfully');
} catch (error) {
  console.error('Error initializing app:', error);
  // Create a minimal error handler for Vercel
  handler = (req, res) => {
    console.error('Error in request handler:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'production' ? {} : error.message
    });
  };
}

module.exports = handler;

// Only start the server if this file is run directly (not when required as a module)
if (require.main === module) {
  const PORT = config.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
  });
}
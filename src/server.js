const app = require('./app');
const http = require('http');
const config = require('./config/environment');

const server = http.createServer(app);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || config.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
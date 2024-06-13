const cors = require('cors');

const corsMiddleware = cors({
  origin: '*', // Allow all origins, adjust as needed for security
  methods: '*', // Allow all methods
});

module.exports = corsMiddleware;
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const bodyParserMiddleware = require('./middleware/bodyParser');

const app = express();

// Use middleware
app.use(corsMiddleware);
app.use(bodyParserMiddleware);

module.exports = app;

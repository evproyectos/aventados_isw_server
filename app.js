const express = require('express');
const corsMiddleware = require('./middleware/cors');
const bodyParserMiddleware = require('./middleware/bodyParser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// Use middleware
app.use(corsMiddleware);
app.use(bodyParserMiddleware);

// routes
app.use('/auth',authRoutes);
app.use('/user', userRoutes);


module.exports = app;

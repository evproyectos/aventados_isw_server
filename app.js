const express = require('express');
const corsMiddleware = require('./middleware/cors');
const bodyParserMiddleware = require('./middleware/bodyParser');
const authRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/ride');
const bookingRoute = require('./routes/bookings');
const graphqlRoutes = require('./middleware/graphqlRoutes');

const app = express();

// Use middleware
app.use(corsMiddleware);
app.use(bodyParserMiddleware);
app.use('/graphql', graphqlRoutes);

// routes
app.use('/user', authRoutes);
app.use('/rides', rideRoutes);
app.use('/bookings', bookingRoute);


module.exports = app;

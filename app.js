


const express = require('express');
const corsMiddleware = require('./middleware/cors');
const bodyParserMiddleware = require('./middleware/bodyParser');
const authRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/ride');
const bookingRoute = require('./routes/bookings')



const app = express();

// Use middleware
app.use(corsMiddleware);
app.use(bodyParserMiddleware);

// routes
app.use('/user', authRoutes);
app.use('/rides', rideRoutes);
app.use('/bookings', bookingRoute);

// Comments



module.exports = app;

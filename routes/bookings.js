const express = require('express');
const { bookRide, getBookingsByRideId, getBookingsByDriver, updateBookingStatus, getBookingsByPassenger } = require('../controllers/bookingsController');
const { authenticate } = require('../middleware/auth');
const role = require('../middleware/role');


const router = express.Router();

router.post('/bookride', authenticate, role(['client']), bookRide);
router.get('/ride/:rideId', role(['driver']), getBookingsByRideId); 
router.get('/driver/:driverId',authenticate, role(['driver']), getBookingsByDriver); 
router.put('/:bookingId/status', authenticate, role(['driver']), updateBookingStatus);
router.get('/passenger/:passengerId', getBookingsByPassenger);


module.exports = router;

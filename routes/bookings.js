// Import necessary modules
const express = require('express');
const { 
    bookRide, 
    getBookingsByRideId, 
    getBookingsByDriver, 
    updateBookingStatus, 
    getBookingsByPassenger 
} = require('../controllers/bookingsController');
const { authenticate } = require('../middleware/auth');
const role = require('../middleware/role');

// Initialize the router
const router = express.Router();

/**
 * @route POST /bookride
 * @description Book a ride as a client. This route is only accessible to users with the 'client' role.
 * @access Protected (requires authentication and 'client' role)
 */
router.post('/bookride', authenticate, role(['client']), bookRide);

/**
 * @route GET /ride/:rideId
 * @description Get all bookings for a specific ride. This route is only accessible to users with the 'driver' role.
 * @access Protected (requires 'driver' role)
 */
router.get('/ride/:rideId', role(['driver']), getBookingsByRideId);

/**
 * @route GET /driver/:driverId
 * @description Get all bookings associated with a specific driver. This route is only accessible to authenticated users with the 'driver' role.
 * @access Protected (requires authentication and 'driver' role)
 */
router.get('/driver/:driverId', authenticate, role(['driver']), getBookingsByDriver);

/**
 * @route PUT /:bookingId/status
 * @description Update the status of a booking (e.g., accept or reject a booking). This route is only accessible to authenticated users with the 'driver' role.
 * @access Protected (requires authentication and 'driver' role)
 */
router.put('/:bookingId/status', authenticate, role(['driver']), updateBookingStatus);

/**
 * @route GET /passenger/:passengerId
 * @description Get all bookings made by a specific passenger. This route is only accessible to authenticated users with the 'client' role.
 * @access Protected (requires authentication and 'client' role)
 */
router.get('/passenger/:passengerId', authenticate, role(['client']), getBookingsByPassenger);

// Export the router for use in other parts of the application
module.exports = router;

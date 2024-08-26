// Import necessary modules
const express = require('express');
const { authenticate } = require('../middleware/auth');
const role = require('../middleware/role');
const {
    createRide,
    getRides,
    getRidesByDriver,
    getRideById,
    updateRide,
    deleteRide,
    bookRide
} = require('../controllers/rideController');

// Initialize the router
const router = express.Router();

/**
 * @route POST /
 * @description Create a new ride. This route is only accessible to authenticated users with the 'driver' role.
 * @access Protected (requires authentication and 'driver' role)
 */
router.post('/', authenticate, role(['driver']), createRide);

/**
 * @route GET /
 * @description Get all available rides. This route is only accessible to authenticated users.
 * @access Protected (requires authentication)
 */
router.get('/', authenticate, getRides);

/**
 * @route GET /:id
 * @description Get a specific ride by its ID. This route is only accessible to authenticated users.
 * @access Protected (requires authentication)
 */
router.get('/:id', authenticate, getRideById);

/**
 * @route GET /driver/:driverId
 * @description Get all rides created by a specific driver. This route is only accessible to authenticated users with the 'driver' role.
 * @access Protected (requires authentication and 'driver' role)
 */
router.get('/driver/:driverId', authenticate, role(['driver']), getRidesByDriver);

/**
 * @route PUT /:id
 * @description Update an existing ride by its ID. This route is only accessible to authenticated users with the 'driver' role.
 * @access Protected (requires authentication and 'driver' role)
 */
router.put('/:id', authenticate, role(['driver']), updateRide);

/**
 * @route DELETE /:id
 * @description Delete a specific ride by its ID. This route is only accessible to authenticated users with the 'driver' role.
 * @access Protected (requires authentication and 'driver' role)
 */
router.delete('/:id', authenticate, role(['driver']), deleteRide);

// Export the router for use in other parts of the application
module.exports = router;

const express = require('express');
const { authenticate } = require('../middleware/auth');
const role = require('../middleware/role');
const {
    createRide,
    getRides,
    getRideById,
    updateRide,
    deleteRide,
    bookRide
} = require('../controllers/rideController');

const router = express.Router();

router.post('/', authenticate, role(['driver']), createRide);
router.get('/', authenticate, getRides);
router.get('/:id', authenticate, getRideById);
router.put('/:id', authenticate, role(['driver']), updateRide);
router.delete('/:id', authenticate, role(['driver']), deleteRide);
router.post('/:id/book', authenticate, role(['client']), bookRide);

module.exports = router;

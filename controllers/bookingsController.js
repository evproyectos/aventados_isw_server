// Import necessary models
const Booking = require('../models/bookingsModel');
const Ride = require('../models/rideModel');

/**
 * Controller to handle booking a ride.
 * Only users with the role 'client' are allowed to book a ride.
 * 
 * @param {Object} req - Express request object containing user and booking data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with booking details or an error message.
 */
const bookRide = async (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can book rides' });
    }

    const { rideId, passengerId } = req.body;

    try {
        // Find the ride by ID
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if there are available seats
        if (ride.availableSeats <= 0) {
            return res.status(400).json({ message: 'No available seats' });
        }

        await ride.save();

        // Create a new booking
        const booking = new Booking({
            ride: rideId,
            passenger: req.user.id,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to get all bookings for a specific ride.
 * 
 * @param {Object} req - Express request object containing the ride ID in params.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response with bookings data or an error message.
 */
const getBookingsByRideId = async (req, res) => {
    try {
        const { rideId } = req.params;
        
        // Find bookings by ride ID and populate ride and passenger details
        const bookings = await Booking.find({ ride: rideId }).populate('ride').populate('passenger');
        
        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this ride' });
        }
        
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Controller to get all bookings for rides managed by a specific driver.
 * 
 * @param {Object} req - Express request object containing the driver ID in params.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response with bookings data or an error message.
 */
const getBookingsByDriver = async (req, res) => {
    try {
        const { driverId } = req.params;

        // Find all rides managed by the driver
        const rides = await Ride.find({ driver: driverId });

        if (!rides.length) {
            return res.status(404).json({ message: 'No rides found for this driver' });
        }

        const rideIds = rides.map(ride => ride._id);

        // Find bookings for the driver's rides and populate ride and passenger details
        const bookings = await Booking.find({ ride: { $in: rideIds } })
            .populate('ride')
            .populate('passenger');

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this driver' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Controller to update the status of a booking (accept or reject).
 * 
 * @param {Object} req - Express request object containing the booking ID in params and the action in the body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with success message or an error message.
 */
const updateBookingStatus = async (req, res, next) => {
    const { bookingId } = req.params;
    const { action } = req.body;

    if (!['accept', 'reject'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
    }

    try {
        // Find the booking by ID and populate the associated ride details
        const booking = await Booking.findById(bookingId).populate('ride');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const ride = booking.ride;

        if (action === 'accept') {
            if (ride.availableSeats <= 0) {
                return res.status(400).json({ message: 'No available seats' });
            }

            booking.status = 'confirmed';
            ride.availableSeats -= 1;
            await ride.save();
        } else if (action === 'reject') {
            booking.status = 'cancelled';
        }

        await booking.save();
        res.status(200).json({ message: `Booking ${action}ed successfully`, booking });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to get all bookings made by a specific passenger.
 * 
 * @param {Object} req - Express request object containing the passenger ID in params.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response with bookings data or an error message.
 */
const getBookingsByPassenger = async (req, res) => {
    try {
        const { passengerId } = req.params;
        
        // Find bookings by passenger ID and populate ride and passenger details
        const bookings = await Booking.find({ passenger: passengerId })
            .populate('ride')
            .populate('passenger');
        
        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this passenger' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all controllers
module.exports = { bookRide, getBookingsByRideId, getBookingsByDriver, updateBookingStatus, getBookingsByPassenger };

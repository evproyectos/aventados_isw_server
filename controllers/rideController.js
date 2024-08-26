const Ride = require('../models/rideModel');

/**
 * Controller to create a new ride.
 * Only users with the role 'driver' are allowed to create rides.
 * 
 * @param {Object} req - Express request object containing user and ride data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with ride details or an error message.
 */
const createRide = async (req, res, next) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Only drivers can create rides' });
    }

    const { origin, destination, departureTime, availableSeats, fee } = req.body;

    try {
        // Create a new ride with the provided details
        const ride = new Ride({
            driver: req.user._id,
            origin,
            destination,
            departureTime,
            availableSeats,
            fee
        });
        await ride.save();
        res.status(201).json({ message: 'Ride created successfully', ride });
    } catch (error) {
        next(error);
        console.log(error);
    }
};

/**
 * Controller to get all rides.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with a list of all rides or an error message.
 */
const getRides = async (req, res, next) => {
    try {
        // Retrieve all rides and populate driver and passenger details
        const rides = await Ride.find().populate('driver').populate('passengers');
        res.json(rides);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to get all rides by a specific driver.
 * 
 * @param {Object} req - Express request object containing the driver ID in params.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with rides data or an error message.
 */
const getRidesByDriver = async (req, res, next) => {
    try {
        // Find rides by driver ID and populate driver and passenger details
        const rides = await Ride.find({ driver: req.params.driverId }).populate('driver').populate('passengers');
        if (rides.length === 0) {
            return res.status(404).json({ message: 'No rides found for this driver' });
        }
        res.status(201).json(rides);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to get a single ride by ID.
 * 
 * @param {Object} req - Express request object containing the ride ID in params.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with ride details or an error message.
 */
const getRideById = async (req, res, next) => {
    try {
        // Find the ride by ID and populate driver and passenger details
        const ride = await Ride.findById(req.params.id).populate('driver').populate('passengers');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.json(ride);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to update a ride.
 * Only users with the role 'driver' can update rides, and they can only update their own rides.
 * 
 * @param {Object} req - Express request object containing the ride ID in params and updated ride data in the body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with updated ride details or an error message.
 */
const updateRide = async (req, res, next) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Only drivers can update rides' });
    }

    try {
        // Find the ride by ID
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if the driver owns the ride
        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only update your own rides' });
        }

        // Update the ride with new details
        const { origin, destination, departureTime, availableSeats, fee } = req.body;
        ride.origin = origin;
        ride.destination = destination;
        ride.departureTime = departureTime;
        ride.availableSeats = availableSeats;
        ride.fee = fee;
        await ride.save();

        res.json({ message: 'Ride updated successfully', ride });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to delete a ride.
 * Only users with the role 'driver' can delete rides, and they can only delete their own rides.
 * 
 * @param {Object} req - Express request object containing the ride ID in params.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with success message or an error message.
 */
const deleteRide = async (req, res, next) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Only drivers can delete rides' });
    }

    try {
        // Find the ride by ID
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if the driver owns the ride
        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only delete your own rides' });
        }

        await ride.deleteOne();
        res.json({ message: 'Ride deleted successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to book a ride.
 * Only users with the role 'client' are allowed to book rides.
 * 
 * @param {Object} req - Express request object containing the ride ID in params.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response with updated ride details or an error message.
 */
const bookRide = async (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can book rides' });
    }

    try {
        // Find the ride by ID
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if there are available seats
        if (ride.availableSeats <= 0) {
            return res.status(400).json({ message: 'No available seats' });
        }

        // Add the passenger to the ride and decrease available seats
        ride.passengers.push(req.user._id);
        ride.availableSeats -= 1;
        await ride.save();

        res.status(201).json(ride);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRide,
    getRides,
    getRidesByDriver,
    getRideById,
    updateRide,
    deleteRide,
    bookRide
};

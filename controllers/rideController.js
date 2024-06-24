const Ride = require('../models/rideModel');

// Create a new ride
const createRide = async (req, res, next) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Only drivers can create rides' });
    }

    const { origin, destination, departureTime, availableSeats } = req.body;

    try {
        const ride = new Ride({
            driver: req.user._id,
            origin,
            destination,
            departureTime,
            availableSeats
        });
        await ride.save();
        res.json({ message: 'Ride created successfully', ride });
    } catch (error) {
        next(error);
    }
};

// Get all rides
const getRides = async (req, res, next) => {
    try {
        const rides = await Ride.find().populate('driver').populate('passengers');
        res.json(rides);
    } catch (error) {
        next(error);
    }
};

// Get a single ride by ID
const getRideById = async (req, res, next) => {
    try {
        const ride = await Ride.findById(req.params.id).populate('driver').populate('passengers');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.json(ride);
    } catch (error) {
        next(error);
    }
};

// Update a ride
const updateRide = async (req, res, next) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Only drivers can update rides' });
    }

    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only update your own rides' });
        }

        const { origin, destination, departureTime, availableSeats } = req.body;
        ride.origin = origin;
        ride.destination = destination;
        ride.departureTime = departureTime;
        ride.availableSeats = availableSeats;
        await ride.save();

        res.json({ message: 'Ride updated successfully', ride });
    } catch (error) {
        next(error);
    }
};

// Delete a ride
const deleteRide = async (req, res, next) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Only drivers can delete rides' });
    }

    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only delete your own rides' });
        }

        await ride.remove();
        res.json({ message: 'Ride deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Book a ride
const bookRide = async (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can book rides' });
    }

    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.availableSeats <= 0) {
            return res.status(400).json({ message: 'No available seats' });
        }

        ride.passengers.push(req.user._id);
        ride.availableSeats -= 1;
        await ride.save();

        res.json({ message: 'Ride booked successfully', ride });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRide,
    getRides,
    getRideById,
    updateRide,
    deleteRide,
    bookRide
};

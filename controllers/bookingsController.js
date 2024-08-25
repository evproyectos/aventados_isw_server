const Booking = require('../models/bookingsModel');
const Ride = require('../models/rideModel');

const bookRide = async (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can book rides' });
    }

    const { rideId, passengerId } = req.body;

    try {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.availableSeats <= 0) {
            return res.status(400).json({ message: 'No available seats' });
        }

        await ride.save();

        const booking = new Booking({
            ride: rideId,
            passenger: passengerId,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
};

const getBookingsByRideId = async (req, res) => {
    try {
        const { rideId } = req.params;
        const bookings = await Booking.find({ ride: rideId }).populate('ride').populate('passenger');
        
        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this ride' });
        }
        
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookingsByDriver = async (req, res) => {
    try {
        const { driverId } = req.params;

        const rides = await Ride.find({ driver: driverId });

        if (!rides.length) {
            return res.status(404).json({ message: 'No rides found for this driver' });
        }

        const rideIds = rides.map(ride => ride._id);

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

const updateBookingStatus = async (req, res, next) => {
    const { bookingId } = req.params;
    const { action } = req.body;

    if (!['accept', 'reject'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
    }

    try {
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

const getBookingsByPassenger = async (req, res) => {
    try {
        const { passengerId } = req.params;
        
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


module.exports = { bookRide, getBookingsByRideId, getBookingsByDriver, updateBookingStatus, getBookingsByPassenger };

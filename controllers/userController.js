const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/userModel');
const admin = require('../firebasAdmin');
const { sendSMS } = require('../utils/sendSMS');
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

/**
 * Register a new user.
 * Hashes the user's password, generates a verification token and pin, 
 * and sends a verification email. The user's state is initially set to "pending".
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const register = async (req, res, next) => {
    const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY,
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationPin = '123456';

    const { uid, name, lastName, email, password, idNumber, birthDate, phoneNumber, role, plate, brand, model, year } = req.body;
    const state = 'pending';

    const sentFrom = new Sender("aventados3@trial-pr9084zx278lw63d.mlsender.net", "Aventados");
    const recipients = [
        new Recipient(email, name)
    ];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject("Correo de Verificacion")
        .setHtml(`<strong>Haz clic en el siguiente enlace para verificar tu cuenta: http://localhost:5173/verify?token=${verificationToken}<strong>`)
        .setText(`Haz clic en el siguiente enlace para verificar tu cuenta: http://localhost:5173/verify?token=${verificationToken}`);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            uid, name, lastName, email, password: hashedPassword, idNumber, birthDate, phoneNumber, role, plate, brand, model, year, state, verificationToken, verificationPin
        });

        await user.save();
        mailerSend.email
            .send(emailParams)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));

        res.status(201).json({ uid, name, lastName, email, password: hashedPassword, idNumber, birthDate, phoneNumber, role, plate, brand, model, year, verificationPin });
    } catch (error) {
        next(error);
    }
};

/**
 * Verifies a Google authentication token.
 * Checks if the user exists and is verified, sends a 6-digit verification PIN via SMS,
 * and saves it in the database.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const verifyTokenGoogle = async (req, res, next) => {
    const token1 = req.body.token;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token1);
        const uid = decodedToken.uid;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.state !== "active") {
            return res.status(401).json({ message: 'User not verified' });
        }

        const pin = Math.floor(100000 + Math.random() * 900000);

        await sendSMS(user.phoneNumber, `Your verification PIN is ${pin}`);

        user.verificationPin = pin;
        await user.save();

        res.status(200).json({ message: 'PIN sent to your phone. Please verify.', userId: user._id });
    } catch (error) {
        console.log(error);
        res.status(401).send('Invalid token');
    }
};

/**
 * Verifies a user's account using a verification token.
 * If the token matches, the user's state is updated to "active".
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const verify = async (req, res, next) => {
    const token = req.body.token;

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verificationToken == token) {
            user.state = 'active';
        }

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        next(error);
        console.log(error);
    }
};

/**
 * Logs in a user.
 * Checks if the user exists and is verified, compares the password,
 * generates a 6-digit verification PIN, sends it via SMS, and saves it in the database.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.state !== "active") {
            return res.status(401).json({ message: 'User not verified' });
        }

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const pin = Math.floor(100000 + Math.random() * 900000);

        await sendSMS(user.phoneNumber, `Your verification PIN is ${pin}`);

        user.verificationPin = pin;
        await user.save();

        res.status(200).json({ message: 'PIN sent to your phone. Please verify.', userId: user._id });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

/**
 * Verifies the PIN entered by the user.
 * If the PIN is correct, generates a JWT token for the user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const verifyPin = async (req, res, next) => {
    const { userId, pin } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verificationPin === pin) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1 hour',
            });

            user.verificationPin = null;
            user.pinExpiresAt = null;
            await user.save();

            res.status(200).json({ token });
        } else {
            res.status(400).json({ message: 'Invalid or expired PIN' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves the profile information of the authenticated user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const profile = async (req, res) => {
    res.status(201).json(req.user);
};

/**
 * Updates the user's information.
 * Hashes the password if it is being updated.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const updateUser = async (req, res, next) => {
    const { name, lastName, email, password, idNumber, birthDate, phoneNumber, role, plate, brand, model, year } = req.body;

    try {
        const user = await User.findOne(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (idNumber) user.idNumber = idNumber;
        if (birthDate) user.birthDate = birthDate;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        if (user.role === 'driver') {
            if (plate) user.plate = plate;
            if (brand) user.brand = brand;
            if (model) user.model = model;
            if (year) user.year = year;
        }

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes the authenticated user's account.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, profile, updateUser, deleteUser, verify, verifyTokenGoogle, verifyPin };

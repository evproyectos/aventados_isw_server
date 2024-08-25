const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/userModel');
const admin = require('../firebasAdmin');
const { sendSMS } = require('../utils/sendSMS');
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

// Register a new user
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

const verifyTokenGoogle = async (req, res, next) => {
    const token1 = req.body.token;

    console.log(token1);
    try {
        const decodedToken = await admin.auth().verifyIdToken(token1);
        const uid = decodedToken.uid;
        console.log(uid);

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.state !== "active") {
            return res.status(401).json({ message: 'User not verified' });
        }

        // Generate a 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000);

        // Send the PIN via SMS
        await sendSMS(user.phoneNumber, `Your verification PIN is ${pin}`);

        // Save the PIN and expiration time in the database
        user.verificationPin = pin;
        await user.save();

        res.status(200).json({ message: 'PIN sent to your phone. Please verify.', userId: user._id });
    } catch (error) {
        console.log(error);
        res.status(401).send('Invalid token');
    }
};

const verify = async (req, res, next) => {
    const token = req.body.token;
    console.log(token);

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

// Login with an existing user 
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

        // Generate a 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000);

        // Send the PIN via SMS
        await sendSMS(user.phoneNumber, `Your verification PIN is ${pin}`);

        // Save the PIN and expiration time in the database
        user.verificationPin = pin;
        await user.save();

        res.status(200).json({ message: 'PIN sent to your phone. Please verify.', userId: user._id });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const verifyPin = async (req, res, next) => {
    const { userId, pin } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(user.verificationPin);

        // Verify if the PIN is correct and not expired
        if (user.verificationPin === pin) {
            // The PIN is correct, generate the JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1 hour',
            });

            // Clear the PIN and expiration from the database
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

// Get the information of the user
const profile = async (req, res) => {
    res.status(201).json(req.user);
};

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

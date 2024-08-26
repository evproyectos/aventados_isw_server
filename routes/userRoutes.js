// Import necessary modules
const express = require('express');
const { register, login, profile, updateUser, deleteUser, verify, verifyTokenGoogle, verifyPin } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Initialize the router
const router = express.Router();

/**
 * @route POST /register
 * @description Register a new user. This route is accessible without authentication.
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /login
 * @description Log in an existing user and initiate PIN verification. This route is accessible without authentication.
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /verify_pin
 * @description Verify a PIN sent to the user's phone. This route is accessible without authentication.
 * @access Public
 */
router.post('/verify_pin', verifyPin);

/**
 * @route GET /profile
 * @description Get the profile information of the currently authenticated user.
 * @access Protected (requires authentication)
 */
router.get('/profile', authenticate, profile);

/**
 * @route PUT /update
 * @description Update the profile information of the currently authenticated user. This route is only accessible to authenticated users.
 * @access Protected (requires authentication)
 */
router.put('/update', authenticate, updateUser);

/**
 * @route PUT /verify
 * @description Verify a user's account using a verification token. This route is accessible without authentication.
 * @access Public
 */
router.put('/verify', verify);

/**
 * @route POST /verify-token
 * @description Verify a Google authentication token and send a PIN for verification. This route is accessible without authentication.
 * @access Public
 */
router.post('/verify-token', verifyTokenGoogle);

/**
 * @route DELETE /delete
 * @description Delete the account of the currently authenticated user. This route is only accessible to authenticated users.
 * @access Protected (requires authentication)
 */
router.delete('/delete', authenticate, deleteUser);

// Export the router for use in other parts of the application
module.exports = router;

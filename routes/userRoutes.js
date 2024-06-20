const express = require('express');
const { register, login, profile, updateUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticate, profile);
router.put('/update', authenticate, updateUser);




module.exports = router;
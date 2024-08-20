const express = require('express');
const { register, login, profile, updateUser, deleteUser, verify, verifyTokenGoogle } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticate, profile);
router.put('/update', authenticate, updateUser);
router.put('/verify', verify);
router.post('/verify-token', verifyTokenGoogle);
router.delete('/delete', authenticate, deleteUser);



module.exports = router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Register a new user
const register = async (req, res, next) => {
  const { name, lastName, email, password, idNumber, birthDate, phoneNumber, role, plate, brand, model, year } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, lastName, email, password: hashedPassword, idNumber, birthDate, phoneNumber, role, plate, brand, model, year });
    
    await user.save();
    res.status(201).json({ name, lastName, email, password: hashedPassword, idNumber, birthDate, phoneNumber, role, plate, brand, model, year });
  } catch (error) {
    next(error);
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

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1 hour'
    });
    res.status(201).json({ token });
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

    if(user.role === 'driver'){
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



module.exports = { register, login, profile, updateUser, deleteUser};
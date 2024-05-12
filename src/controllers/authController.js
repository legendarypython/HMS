// authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const accessRightsValidation = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt');

// Register a new user
exports.register = async (req, res, next) => {
  try {

   await accessRightsValidation(req.body.accessRights);
    const { username, email, password, mobile, accessRights } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] });
    if (existingUser) {
     throw (new Error('User already exists'));
    }

    

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: password, 
      mobile: mobile, 
      accessRights: accessRights
    });

    await newUser.save();

   return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;

    // Find the user by email or mobile
    const user = await User.findOne( { mobile: mobile  });
    if (!user) {
     return next(new Error('Invalid mobile or password'));
    }

    // Verify password
    const isPasswordValid =  bcrypt.compare(password, user.password);
    if (!isPasswordValid) {

    return  next(new Error('Invalid mobile or password'));
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.token = token; 
    await user.save();


   return res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return next(error);
  }
};

// Logout user (optional)
exports.logout = (req, res) => {
  // Your logout logic here
};

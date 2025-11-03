const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword
} = require('../validators/authValidator');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, validate, register);
router.post('/login', validateLogin, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validateUpdateProfile, validate, updateProfile);
router.put('/password', protect, validateChangePassword, validate, changePassword);
router.post('/logout', protect, logout);

module.exports = router;

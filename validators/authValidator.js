const { body } = require('express-validator');

// Registration validation rules
exports.validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3-50 characters'),
  
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^03[0-9]{9}$/).withMessage('Please provide a valid Pakistani phone number (03XXXXXXXXX)'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email'),
  
  body('role')
    .optional()
    .isIn(['customer', 'shopkeeper', 'admin']).withMessage('Invalid role')
];

// Login validation rules
exports.validateLogin = [
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^03[0-9]{9}$/).withMessage('Please provide a valid Pakistani phone number'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Update profile validation
exports.validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3-50 characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
];

// Change password validation
exports.validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

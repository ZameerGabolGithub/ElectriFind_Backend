const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null for customers without email
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^03[0-9]{9}$/.test(v); // Pakistani format
      },
      message: 'Please provide a valid Pakistani phone number (03XXXXXXXXX)'
    }
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },

  // Role Management (Multi-role as per schema[67])
  role: {
    type: String,
    enum: {
      values: ['customer', 'shopkeeper', 'admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'customer',
    index: true
  },

  // Profile & Settings
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  
  address: {
    street: String,
    area: String,
    city: { type: String, default: 'Karachi' },
    district: { type: String, default: 'Defence' }
  },

  // Geospatial Location (for nearby queries)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },

  // Loyalty & Rewards (as per schema[67])
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points cannot be negative']
  },
  
  totalReferrals: {
    type: Number,
    default: 0
  },

  // Verification & Status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },

  // FCM Token for Push Notifications (FYP2)
  fcmToken: String,

  // Timestamps
  lastLogin: Date

}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for performance (as per schema[67])
userSchema.index({ location: '2dsphere' }); // Geospatial queries
userSchema.index({ role: 1, isActive: 1 }); // Role-based queries
// userSchema.index({ phone: 1 }, { unique: true });

// Pre-save middleware: Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

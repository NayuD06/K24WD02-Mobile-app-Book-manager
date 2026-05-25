const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const passwordHasUppercase = /[A-Z]/;
const passwordHasSpecialChar = /[^A-Za-z0-9]/;
const emailHasAtSymbol = /@/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [6, 'Username phải có ít nhất 6 ký tự'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailHasAtSymbol, 'Email phải có ký tự @'],
  },
  password: {
    type: String,
    required: false,
    minlength: [8, 'Password phải có ít nhất 8 ký tự'],
    validate: {
      validator: function (value) {
        if (!value) return true; // only validate when password is provided
        return passwordHasUppercase.test(value) && passwordHasSpecialChar.test(value);
      },
      message: 'Password phải có ít nhất 1 chữ in hoa và 1 ký tự đặc biệt',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String,
    trim: true,
  },
  fcmTokens: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  if (!this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

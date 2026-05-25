const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Title phải có ít nhất 3 ký tự'],
  },
  author: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Author phải có ít nhất 3 ký tự'],
  },
  description: {
    type: String,
    trim: true,
    minlength: [10, 'Description phải có ít nhất 10 ký tự'],
  },
  publishedDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!value) return true;
        return value <= new Date();
      },
      message: 'Published date không được lớn hơn hiện tại',
    },
  },
  genre: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Genre phải có ít nhất 2 ký tự'],
  },
  coverImage: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', bookSchema);

const Review = require('../models/Review');
const Book = require('../models/Book');
const mongoose = require('mongoose');

const isValidComment = (value) => typeof value === 'string' && value.trim().length >= 5;
const isValidRating = (value) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 5;

const getReviews = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate('book', 'title author')
      .populate('user', 'name email');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('book', 'title author')
      .populate('user', 'name email');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { bookId, rating, comment } = req.body;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'bookId không hợp lệ' });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (rating == null) {
      return res.status(400).json({ message: 'Rating là bắt buộc' });
    }

    if (!isValidRating(rating)) {
      return res.status(400).json({ message: 'Rating phải từ 1 đến 5' });
    }

    if (!isValidComment(comment)) {
      return res.status(400).json({ message: 'Comment phải có ít nhất 5 ký tự' });
    }

    const review = new Review({ book: bookId, user: req.user._id, rating, comment });
    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (rating != null) {
      if (!isValidRating(rating)) {
        return res.status(400).json({ message: 'Rating phải từ 1 đến 5' });
      }
      review.rating = rating;
    }

    if (comment != null && !isValidComment(comment)) {
      return res.status(400).json({ message: 'Comment phải có ít nhất 5 ký tự' });
    }

    review.comment = comment ?? review.comment;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getReviewsByBook = async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByBook,
};

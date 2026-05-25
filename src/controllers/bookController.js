const Book = require('../models/Book');
const Review = require('../models/Review');

const isValidBookText = (value, minLength) => typeof value === 'string' && value.trim().length >= minLength;
const isValidFutureSafeDate = (value) => !value || new Date(value) <= new Date();
const isOwnerOrAdmin = (reqUser, book) => {
  if (!reqUser || !book) return false;
  return reqUser.role === 'admin' || (book.owner && book.owner.toString() === reqUser._id.toString());
};

const getBooks = async (req, res, next) => {
  try {
    const { author, genre } = req.query;
    const filter = {};

    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .populate('owner', 'name email role');
    res.json(books);
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('owner', 'name email role');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const reviews = await Review.find({ book: book._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email role');
    const ratingSummary = await Review.aggregate([
      { $match: { book: book._id } },
      {
        $group: {
          _id: '$book',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    const summary = ratingSummary[0] || { averageRating: 0, ratingCount: 0 };

    res.json({
      ...book.toObject(),
      ratingAverage: Number(summary.averageRating.toFixed(1)),
      ratingCount: summary.ratingCount,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, author, description, publishedDate, genre } = req.body;
    // cover may be uploaded via multer -> req.file
    let coverImage = req.body.coverImage;
    if (req.file) {
      coverImage = `/img/${req.file.filename}`;
    }

    if (!isValidBookText(title, 3)) {
      return res.status(400).json({ message: 'Title phải có ít nhất 3 ký tự' });
    }

    if (!isValidBookText(author, 3)) {
      return res.status(400).json({ message: 'Author phải có ít nhất 3 ký tự' });
    }

    if (!isValidBookText(genre, 2)) {
      return res.status(400).json({ message: 'Genre là bắt buộc và phải có ít nhất 2 ký tự' });
    }

    if (description != null && !isValidBookText(description, 10)) {
      return res.status(400).json({ message: 'Description phải có ít nhất 10 ký tự' });
    }

    if (!isValidFutureSafeDate(publishedDate)) {
      return res.status(400).json({ message: 'Published date không được lớn hơn hiện tại' });
    }

    const book = new Book({
      owner: req.user._id,
      title,
      author,
      description,
      publishedDate,
      genre,
      coverImage,
    });
    const createdBook = await book.save();
    const populatedBook = await createdBook.populate('owner', 'name email role');
    res.status(201).json(populatedBook);
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { title, author, description, publishedDate, genre } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!isOwnerOrAdmin(req.user, book)) {
      return res.status(403).json({ message: 'Chỉ chủ sách hoặc admin mới được sửa sách' });
    }

    if (title != null && !isValidBookText(title, 3)) {
      return res.status(400).json({ message: 'Title phải có ít nhất 3 ký tự' });
    }

    if (author != null && !isValidBookText(author, 3)) {
      return res.status(400).json({ message: 'Author phải có ít nhất 3 ký tự' });
    }

    if (genre != null && !isValidBookText(genre, 2)) {
      return res.status(400).json({ message: 'Genre phải có ít nhất 2 ký tự' });
    }

    if (description != null && !isValidBookText(description, 10)) {
      return res.status(400).json({ message: 'Description phải có ít nhất 10 ký tự' });
    }

    if (publishedDate != null && !isValidFutureSafeDate(publishedDate)) {
      return res.status(400).json({ message: 'Published date không được lớn hơn hiện tại' });
    }

    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.description = description ?? book.description;
    book.publishedDate = publishedDate ?? book.publishedDate;
    book.genre = genre ?? book.genre;
    if (req.file) {
      book.coverImage = `/img/${req.file.filename}`;
    } else if (req.body.coverImage != null) {
      book.coverImage = req.body.coverImage ?? book.coverImage;
    }

    const updatedBook = await book.save();
    const populatedBook = await updatedBook.populate('owner', 'name email role');
    res.json(populatedBook);
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!isOwnerOrAdmin(req.user, book)) {
      return res.status(403).json({ message: 'Chỉ chủ sách hoặc admin mới được xóa sách' });
    }

    await Review.deleteMany({ book: book._id });
    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getSuggestedBooks = async (req, res, next) => {
  try {
    const { genre } = req.query;
    const match = {};

    if (genre) {
      match.genre = new RegExp(genre, 'i');
    }

    const suggestedBooks = await Book.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'book',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
          ratingCount: { $size: '$reviews' },
        },
      },
      { $sort: { averageRating: -1, ratingCount: -1, createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          reviews: 0,
        },
      },
    ]);

    res.json(suggestedBooks);
  } catch (error) {
    next(error);
  }
};

const getReviewsByBook = async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email role');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getSuggestedBooks,
  getReviewsByBook,
};

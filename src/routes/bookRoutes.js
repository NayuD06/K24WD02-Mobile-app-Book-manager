const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getSuggestedBooks,
  getReviewsByBook,
} = require('../controllers/bookController');
// multer storage to img folder at project root
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'img'));
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-z0-9.\-]/gi, '_');
    cb(null, safe);
  },
});
const upload = multer({ storage });
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBooks).post(protect, upload.single('cover'), createBook);
router.route('/suggestions').get(getSuggestedBooks);
router.route('/:id').get(protect, getBookById).put(protect, upload.single('cover'), updateBook).delete(protect, deleteBook);
router.route('/:bookId/reviews').get(getReviewsByBook);

module.exports = router;

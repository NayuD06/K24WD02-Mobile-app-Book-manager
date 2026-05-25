const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getUsers,
  getUserById,
  getUserProfile,
  loginUser,
  googleSignIn,
  createUser,
  saveMyFcmToken,
  updateUser,
  deleteUser,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

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

router.post('/login', loginUser);
router.post('/google', googleSignIn);
router.route('/').get(protect, getUsers).post(upload.single('avatar'), createUser);
router.post('/me/fcm-token', protect, saveMyFcmToken);
router.route('/profile').get(protect, getUserProfile).put(protect, upload.single('avatar'), updateUserProfile);
router.route('/:id').get(protect, getUserById).put(protect, upload.single('avatar'), updateUser).delete(protect, deleteUser);

module.exports = router;

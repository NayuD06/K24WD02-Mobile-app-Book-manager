const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { broadcastNotification } = require('../controllers/notificationController');

router.post('/broadcast', protect, broadcastNotification);

module.exports = router;
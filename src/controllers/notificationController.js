const User = require('../models/User');
const { sendMulticastNotification } = require('../services/firebaseAdmin');

const broadcastNotification = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privilege required' });
    }

    const { title, body, data } = req.body || {};

    if (!title || !body) {
      return res.status(400).json({ message: 'title and body are required' });
    }

    const users = await User.find({ fcmTokens: { $exists: true, $ne: [] } }).select('fcmTokens');
    const tokens = users.flatMap((user) => user.fcmTokens || []);

    const result = await sendMulticastNotification(tokens, { title, body }, data || {});

    res.json({
      message: 'Broadcast sent',
      targetUsers: users.length,
      targetTokens: new Set(tokens).size,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  broadcastNotification,
};
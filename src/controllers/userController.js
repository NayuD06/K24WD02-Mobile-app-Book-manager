const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '111540371054-qnmip7j6mh2afd6opq1b4bl9rql6tpnk.apps.googleusercontent.com';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '24h',
  });
};

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : email);

const isValidEmail = (email) => typeof email === 'string' && email.includes('@');

const isValidPassword = (password) =>
  typeof password === 'string' &&
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const isValidUsername = (name) => typeof name === 'string' && name.trim().length >= 6;

const isAdmin = (user) => user && user.role === 'admin';
const isSelf = (reqUser, userId) => reqUser && reqUser.id.toString() === userId.toString();

const getUsers = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: 'Admin privilege required' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!isSelf(req.user, req.params.id) && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const saveMyFcmToken = async (req, res, next) => {
  try {
    const token = req.body?.token || req.body?.fcmToken;

    if (!token || typeof token !== 'string' || !token.trim()) {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const normalizedToken = token.trim();
    if (!Array.isArray(user.fcmTokens)) {
      user.fcmTokens = [];
    }

    if (!user.fcmTokens.includes(normalizedToken)) {
      user.fcmTokens.push(normalizedToken);
      await user.save();
    }

    res.json({ message: 'FCM token saved successfully' });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  req.params.id = req.user.id;
  return updateUser(req, res, next);
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email phải có ký tự @' });
    }

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file ? `/img/${req.file.filename}` : undefined;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email và password là bắt buộc' });
    }

    if (!isValidUsername(name)) {
      return res.status(400).json({ message: 'Username phải có ít nhất 6 ký tự' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email phải có ký tự @' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password phải có ít nhất 8 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt' });
    }

    const existingUser = await User.findOne({ email: normalizeEmail(email) });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({ name, email: normalizeEmail(email), password, avatar });
    const createdUser = await user.save();
    // For privacy, return only a success message instead of user details or token
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const avatar = req.file ? `/img/${req.file.filename}` : null;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!isSelf(req.user, req.params.id) && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (email && email !== user.email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Email phải có ký tự @' });
      }

      const normalizedEmail = normalizeEmail(email);
      const emailExists = await User.findOne({ email: normalizedEmail });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (name != null && !isValidUsername(name)) {
      return res.status(400).json({ message: 'Username phải có ít nhất 6 ký tự' });
    }

    if (password != null && String(password).trim() !== '' && !isValidPassword(password)) {
      return res.status(400).json({ message: 'Password phải có ít nhất 8 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt' });
    }

    user.name = name ?? user.name;
    user.email = email ? normalizeEmail(email) : user.email;
    if (typeof password === 'string' && password.trim() !== '') {
      user.password = password;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    if (role && isAdmin(req.user)) {
      user.role = role;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!isSelf(req.user, req.params.id) && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const ownedBooks = await Book.find({ owner: user._id }).select('_id');
    const ownedBookIds = ownedBooks.map((book) => book._id);

    if (ownedBookIds.length > 0) {
      await Review.deleteMany({ book: { $in: ownedBookIds } });
    }

    await Review.deleteMany({ user: user._id });
    await Book.deleteMany({ owner: user._id });
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const googleSignIn = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken is required' });

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = normalizeEmail(payload.email || '');
    if (!email) return res.status(400).json({ message: 'Google account has no email' });

    let user = await User.findOne({ email });
    if (!user) {
      // create a local user record for first-time Google sign-in
      // Ensure name meets minlength (6) and password meets schema validators
      let name = (payload.name || email.split('@')[0] || 'user').trim();
      if (name.length < 6) {
        const suffix = email.split('@')[0].slice(0, Math.max(0, 6 - name.length));
        name = (name + suffix + 'user').slice(0, 20);
      }

      // generate a compliant password: >=8 chars, with uppercase and special char
      const randomPart = Math.random().toString(36).slice(-6); // letters+digits
      const upper = 'A';
      const special = '!';
      const password = upper + randomPart + special + 'X1';

      // create user without local password for Google sign-in
      user = new User({ name, email, avatar: payload.picture });
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserProfile,
  saveMyFcmToken,
  updateUserProfile,
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  googleSignIn,
};


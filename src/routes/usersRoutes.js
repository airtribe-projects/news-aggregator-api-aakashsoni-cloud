const express = require('express');
const router = express.Router();
// Middleware to check if user is authenticated
const { verifyToken } = require('../middlewares/auth');
const { userSignup, userLogin, getUserPreferences, updateUserPreferences } = require('../controllers/usersController');

// POST /signup endpoint
router.post('/signup', userSignup);

// POST /login endpoint
router.post('/login', userLogin);

// GET /users/preferences endpoint
router.get('/preferences', verifyToken, getUserPreferences);

// POST /users/preferences endpoint
router.put('/preferences', verifyToken, updateUserPreferences);

module.exports = router;

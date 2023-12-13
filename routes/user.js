//controller
const users = require('../controllers/users')

const express = require('express');
const router = express.Router();

const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

// <------------------------- SECTION ------------------------>
//REGISTER
router.get('/register', users.renderRegister);

//post form
router.use(express.urlencoded({ extended: true }));
router.post('/register', catchAsync(users.register));
// <------------------------- SECTION END ------------------------>

// <------------------------- SECTION ------------------------>
//LOGIN
router.get('/login', users.renderLogin);

// const { storeReturnTo } = require('../middleware');
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);
// <------------------------- SECTION END ------------------------>

//isLoggedIn middleware is in middleware.js file

//LOGOUT
router.get('/logout', users.logout);

module.exports = router;
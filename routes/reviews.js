//controller
const reviews = require('../controllers/reviews')

//requires for error(both are in 'utils' folder)
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground');
const Review = require('../models/review');

const express = require('express');
const router = express.Router({ mergeParams: true }); //to send params from one router file to another

//exporting and using joi from 'schemas.js' file
const { reviewSchema } = require('../schemas.js')

//middleware in middleware.js file

//accessing middlewares
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

//Route for submitting a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//Deleting a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
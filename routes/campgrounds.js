//controllers
const campgrounds = require('../controllers/campgrounds')

//requires for error(both are in 'utils' folder)
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground');

//multer and cloudinary
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const express = require('express');
const router = express.Router({ mergeParams: true }); //to send params from one router file to another

//exporting and using joi from 'schemas.js' file
const { campgroundSchema } = require('../schemas.js')

//MIDDLEWARES IN middleware.js file

//accessing middlewares
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//index
router.get('/', catchAsync(campgrounds.index))

//Add new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.use(express.urlencoded({ extended: true }));
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

//Show campgrounds
router.get('/:id', catchAsync(campgrounds.showCampground));

//Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground));

//Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
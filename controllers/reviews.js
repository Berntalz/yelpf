const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;

    //push to 'reviews' array present in 'models/campground.js
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review posted!')   //flash a msg 
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    //$pull removes all values from an array that matches a specified condition
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted your review!')   //flash a msg 
    res.redirect(`/campgrounds/${id}`);
}
const Review= require("../models/review.js");
const Listing = require("../models/listing.js");



// module.exports.createReview = async (req, res, next) => {
//     let listing = await Listing.findById(req.params.id);

//     if (!req.body.review) {
//         throw new ExpressError(400, "Invalid review data");
//     }


//     let newReview = new Review(req.body.review);

//     // console.log(newReview);

//     newReview.author = req.user._id;


//     await newReview.save();

//     listing.reviews.push(newReview._id);
//     await listing.save();

//     req.flash("success", "New Review Created Successfully!");
//     res.redirect(`/listings/${listing._id}`);
// };

module.exports.createReview = async (req, res) => {
    console.log(req.body);

    const listing = await Listing.findById(req.params.id);

    const review = new Review(req.body.review);
    review.author = req.user._id;

    await review.save();

    await Listing.findByIdAndUpdate(req.params.id, {
        $push: { reviews: review._id }
    });

    req.flash("success", "New Review Created Successfully!");
    res.redirect(`/listings/${req.params.id}`);
};



module.exports.destroyReview = async (req,res) => {
        let {id, reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review deleted Successfully! ")
        res.redirect(`/listings/${id}`);

    };
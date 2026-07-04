const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");
// const { index } = require("../controllers/listings.js");



// home and 
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    upload.single("image"),
    // validateListing,
    wrapAsync(listingController.createListing)
    );




//new Route
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm);


        
 //Search route
router.get("/search", async (req, res) => {

    let { q } = req.query;

    if (!q || q.trim() === "") {
        req.flash("error", "Search input is empty");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    });

    res.render("listings/index.ejs", { allListings: listings });
});

//edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync( listingController.renderEditForm));

// //Like Route
// router.post("/:id/like", isLoggedIn, async (req, res) => {

//     let { id } = req.params;

//     let currUser = await User.findById(req.user._id);

//     // already liked
//     let alreadyLiked = currUser.wishlist.some(w =>
//         w.toString() === id
//     );

//     if (alreadyLiked) {
//         currUser.wishlist.pull(id);
//     } else {
//         currUser.wishlist.push(id);
//     }


//     await currUser.save();

//     res.redirect("/listings");

// });
    // Show and update and delete route
router.post("/:id/like", isLoggedIn, async (req, res) => {

    try {
        let { id } = req.params;

        console.log("Listing ID:", id);
        console.log("User:", req.user);

        let currUser = await User.findById(req.user._id);

        if (!currUser) {
            req.flash("error", "User not found");
            return res.redirect("/login");
        }

        let alreadyLiked = currUser.wishlist.some(w =>
            w.toString() === id
        );

        if (alreadyLiked) {
            currUser.wishlist.pull(id);
        } else {
            currUser.wishlist.push(id);
        }

        await currUser.save();

        console.log("Updated wishlist:", currUser.wishlist);

        res.redirect("/listings");

    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
});
    router
        .route("/:id")
        .get(wrapAsync(listingController.showListing))
        .put(
        isLoggedIn,
        isOwner,
        upload.single("image"),
        // validateListing,
        wrapAsync(listingController.updateListing))
        .delete(
        isLoggedIn,
        isOwner, 
        wrapAsync(listingController.destroyListing));
    


    module.exports = router;
    
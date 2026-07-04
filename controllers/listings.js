const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken})


// Index Route
module.exports.index = async (req,res) => {
    // const allListings = await Listing.find({});
    let { category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", {allListings});

    }

// New Form
module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
}

//Show Route
module.exports.showListing = async (req, res) =>{
    let {id} = req.params;

    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate:{
            path: "author",
        }})
    .populate("owner");
    

    if(!listing){
        // return res.send("Listing not found");
        // throw new ExpressError(404, "Listing not found");
        req.flash("error","The listing you requested does not exist. ");
        return res.redirect("/listings");
    }

    // console.log(listing);
    res.render("listings/show.ejs", { listing });

}

// //Create Route
// module.exports.createListing = async (req, res, next) => {
//     let response = await geocodingClient
//     .forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1,
//     }).send();

//     // let url = req.file.path;
//     // let filename = req.file.filename;

//     // console.log(url, "..", filename);
//     const newListing = new Listing(req.body.listing);
//     // newListing.image = { url, filename };
//     // newListing.rating = req.body.listing.rating || 0;

//     newListing.geometry = response.body.features[0].geometry;

//     // let savedListing = await newListing.save();
//     // console.log(savedListing);

//     newListing.owner = req.user._id;

//     if (req.file) {
//         newListing.image = {
//             url: req.file.path,
//             filename: req.file.filename,
//         };
//     }

//     await newListing.save();

//     req.flash("success", "New Listing Created Successfully!");
//     res.redirect("/listings");
//     };

// module.exports.createListing = async (req, res) => {

//     console.log(req.body);
//     console.log(req.file);

//     let response = await geocodingClient
//         .forwardGeocode({
//             query: req.body.listing.location,
//             limit: 1,
//         })
//         .send();

//     const newListing = new Listing(req.body.listing);

//     newListing.geometry = response.body.features[0].geometry;
//     newListing.owner = req.user._id;

//     // ✅ SAFE IMAGE HANDLING
//     if (req.file) {
//         newListing.image = {
//             url: req.file.path,
//             filename: req.file.filename,
//         };
//     } else {
//         newListing.image = {
//             url: "https://via.placeholder.com/300",
//             filename: "default",
//         };
//     }

//     await newListing.save();

//     req.flash("success", "New Listing Created Successfully!");
//     res.redirect("/listings");
// };
// module.exports.createListing = async (req, res) => {

//     console.log(req.body);
//     console.log(req.file);

//     let response = await geocodingClient
//         .forwardGeocode({
//             query: req.body.listing.location,
//             limit: 1,
//         })
//         .send();

//     const newListing = new Listing(req.body.listing);

//     newListing.geometry = response.body.features[0].geometry;
//     // newListing.geometry = {
//     // type: "Point",
//     // coordinates: [73.8567, 18.5204]
//         };

//     newListing.owner = req.user._id;

//     if (req.file) {
//         newListing.image = {
//             url: req.file.path,
//             filename: req.file.filename,
//         };
//     } else {
//         newListing.image = {
//             url: "https://via.placeholder.com/300",
//             filename: "default",
//         };
//     }

//     await newListing.save();

//     req.flash("success", "New Listing Created Successfully!");
//     res.redirect("/listings");

// };
module.exports.createListing = async (req, res) => {

    console.log(req.body);
    console.log(req.file);

    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    const newListing = new Listing(req.body.listing);

    newListing.geometry = response.body.features[0].geometry;

    // optional fallback (safe)
    // newListing.geometry = {
    //     type: "Point",
    //     coordinates: [73.8567, 18.5204]
    // };

    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    } else {
        newListing.image = {
            url: "https://via.placeholder.com/300",
            filename: "default",
        };
    }

    await newListing.save();

    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
};


//Edit Form
module.exports.renderEditForm = async(req,res) =>{
        let {id} = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
        }
        let originalImageurl = listing.image.url;
        originalImageurl = originalImageurl.replace("/upload", "/upload/w_250")

        res.render("listings/edit.ejs", { listing, originalImageurl});
    
    }


// //Update Route
// module.exports.updateListing = async (req, res) => {
//     console.log(req.body);
//     console.log(req.file);

//     let { id } = req.params;

//     if (!req.body.listing) {
//     req.flash("error", "Invalid form data");
//     return res.redirect(`/listings/${id}/edit`);
//     }

//     if (req.body.listing.rating) {
//     req.body.listing.rating = Number(req.body.listing.rating);
//     }

//     let listing = await Listing.findByIdAndUpdate(
//         id,
//         { ...req.body.listing },
//         { new: true }
//     );

//     if (typeof req.file !== "undefined") {
//         let url = req.file.path;
//         let filename = req.file.filename;

//         listing.image = { url, filename };
//         await listing.save();
//     }

//     req.flash("success", "Listing updated successfully!");
//     res.redirect(`/listings/${id}`);
// };
// module.exports.updateListing = async (req, res) => {

//     let { id } = req.params;

//     let listing = await Listing.findById(id);

//     if (!listing) {
//         req.flash("error", "Listing not found");
//         return res.redirect("/listings");
//     }

//     if (!req.body.listing) {
//         req.flash("error", "Invalid form data");
//         return res.redirect(`/listings/${id}/edit`);
//     }

//     // update normal fields safely
//     Object.assign(listing, req.body.listing);

//     // update image ONLY if new file uploaded
//     if (req.file) {
//         listing.image = {
//             url: req.file.path,
//             filename: req.file.filename,
//         };
//     }

//     await listing.save();

//     req.flash("success", "Listing updated successfully!");
//     res.redirect(`/listings/${id}`);
// };
//Delete Route
module.exports.destroyListing = async(req,res) => {
        let {id} = req.params;
        let deleteListing = await Listing.findByIdAndDelete(id);
        // console.log(deleteListing);
        req.flash("success","Listing deleted Successfully! ")
        res.redirect("/listings");
    
    }
module.exports.updateListing = async (req, res) => {

    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!req.body.listing) {
        req.flash("error", "Invalid form data");
        return res.redirect(`/listings/${id}/edit`);
    }

    Object.assign(listing, req.body.listing);

    // 🔥 ADD THIS (IMPORTANT)
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    if (response.body.features.length) {
        listing.geometry = response.body.features[0].geometry;
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};
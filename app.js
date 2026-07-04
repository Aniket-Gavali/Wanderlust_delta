


//! . env config
if(process.env.NODE_ENV != "production") {
    require('dotenv').config();

}

// console.log(process.env.SECRET);



// 2. Core imports

const express = require("express");
const app = express();

app.use((req, res, next) => {
    console.log("🔥 HIT:", req.method, req.originalUrl);
    next();
});

const path = require("path");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose"); 
const methodOverride = require("method-override");

// 3. Models
const Listing = require("./models/listing.js");
const User = require("./models/user.js");

//4. Routes
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//5. Auth(passport)
const passport = require("passport");
const LocalStrategy = require("passport-local");

// 6. Session And Flash
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");


// const { escape } = require("querystring");
const ejsMate = require("ejs-mate");
const {listingSchema, reviewSchema} =require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
// const LocalStrategy = require("passport-local");


// DB_Config
// const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const dbUrl = process.env.ATLASDB_URL;
console.log("DB URL =", dbUrl);

// MongoDB Connection
async function main() {
    await mongoose.connect(dbUrl);
}

// Start server after DB connection
main()
.then(() => {
    console.log("Connected to DB");

    app.listen(8080, () => {
        console.log("Server is listening on port 8080");
    });

})
.catch((err) => {
    console.log(err);
});

//View Engine Setup
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//Middlewares with order
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

// Static Files
app.use(express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in MONGO SESSION STORE", err);
});

//Session Config
const sessionOptions = {
store,
secret: process.env.SECRET,
resave: false,
saveUninitialized:false,
cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
}
} ;







// Passport Config
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Global Variables(Flash + user)
// app.use((req,res,next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//         // current logged in user
//     res.locals.currUser = req.user;
//     // console.log(res.locals.success);
//     next();
// })


app.use(async (req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    if(req.user){

        res.locals.currUser = req.user;

    } else {

        res.locals.currUser = null;

    }

    next();

});


// Routes Usage
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
// app.use("/listings", reviewsRouter);
app.use("/",userRouter);

// Home Route

// app.get("/", (req, res) => {
//     res.redirect("/listings");
// });

// 404 HANDLER
app.use((req,res,next) =>{
    next(new ExpressError(404,"Page not found !"));
});


// Error Handler
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
      // Handle mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
                        .map(e => e.message)
                        .join(", ");

    }

    res.status(statusCode).render("error.ejs",{message});
    // res.render("error.ejs", {message});
    // res.render("error.ejs", {err});
    // res.status(statusCode).send(message);
});





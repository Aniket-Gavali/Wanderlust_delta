const express = require('express');
const app = express();
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
//creating middleware

const sessionOptions = session({
secret: "mysupersecretstring",
resave: false,
saveUninitialized:false,
cookie: {
    maxAge: 604800000, // 7 days
    httpOnly: true
}});

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});


app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req,res) => {
    let {name = "Java"} = req.query;
    req.session.name = name;
    req.flash("success","User registered Successfully");

    if(name === "Java"){
        req.flash("error","User not registered ");
    }else{
        req.flash("success","User registered Successfully");
    }
    res.redirect("/hello");
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/hello",(req,res) => {
    res.render("page.ejs", {name: express.session.name});
});

// app.get("/reqcount", (req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//     req.session.count  = 1;
//     }
//     res.send(`You send a request ${req.session.count} times`);
// })
// app.get("/test", (req,res) => {
//     res.send("Test Successful!");
// });









// secret → used to sign session ID (must be present)
// resave: false → don’t save session if nothing changed
// saveUninitialized: false → don’t create empty sessions
// cookie.maxAge → session expiry time













































// const cookieParser = require("cookie-parser");

// app.use(cookieParser());

// // greet route
// app.get("/greet", (req, res) => {
//     let { name = "anonymous" } = req.cookies;   // ✅ fixed
//     res.send(`Hi ${name}`);
// });

// // set cookies
// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hello");
//     res.cookie("made_in_india", "namaste");

//     // also set name cookie so /greet works
//     res.cookie("name", "Aniket");   // ✅ added

//     res.send("Sent you some cookies!");
// });

// // root route
// app.get('/', (req, res) => {
//     console.log(req.cookies);   // better than console.dir
//     res.send('Hi I am root');
// });

// // routes
// app.use("/users", users);
// app.use("/posts", posts);

// // server
// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true });

var campground = require("./models/campground");
var comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");
var user = require("./models/user");



var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/index");


//seedDB();


//################# passport config #################
app.use(require("express-session")({
    secret : "Siddharth",
    resave : false,
    saveUninitialized : false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


///###########################################################################/



app.listen(3000, function () {
    console.log("app started");
});
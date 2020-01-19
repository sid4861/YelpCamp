var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
var flash = require("connect-flash");
app.use(flash());
var mongoose = require("mongoose");

var dbUrl = process.env.DATABASEURL || "mongodb://localhost:27017/yelpcamp";
// mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true });

//mongoose.connect("mongodb+srv://yelpcampadmin:yelpcampadmin@yelpcamp-cluster-7ua5d.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect(dbUrl);


var campground = require("./models/campground");
var comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");
var user = require("./models/user");
var review = require("./models/reviews");



var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/index");
var reviewRoutes = require("./routes/reviews")


//seedDB();


//################# passport config #################
app.use(require("express-session")({
    secret: "Siddharth",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


///###########################################################################/



app.listen(process.env.PORT || 3000, function () {
    console.log("app started");
});
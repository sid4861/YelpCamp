var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
var flash = require("connect-flash");
app.use(flash());
var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true });

mongoose.connect("mongodb+srv://yelpcampadmin:yelpcampadmin@yelpcamp-cluster-7ua5d.mongodb.net/test?retryWrites=true&w=majority");



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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


///###########################################################################/



app.listen(process.env.PORT || 3000, function () {
    console.log("app started");
});
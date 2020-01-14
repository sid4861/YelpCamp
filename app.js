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
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
seedDB();


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


//#######################################################


app.get("/", function (req, res) {
    console.log("this will be landing page");
    res.render("landing.ejs");


});

app.get("/campgrounds", function (req, res) {

    // get all campgrounds from db
    console.log(req.user);
    campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log("error");
        }
        else {
            res.render("campground/campgrounds.ejs", { campgrounds: campgrounds, currentUser : req.user });
        }
    });

});

app.post("/campgrounds", function (req, res) {
    //read data from form and store in campgrounds array

    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;

    //create a new campground and save to db

    campground.create({
        name: name,
        image: url,
        description: description
    }, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("created");
        }
    });

    //redirect back to campgrounds page

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
    res.render("campground/new.ejs");
});


app.get("/campgrounds/:id", function (req, res) {
    //find the campground with provided id
    campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("========");
            console.log(campground);
            res.render("campground/show.ejs", { campground: campground });
        }
    });
});

//new comment form, nested routes

app.get("/campgrounds/:id/comments/new", isLoggedIn,function (req, res) {

    campground.findById(req.params.id, function (err, foundCampGround) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampGround);
            res.render("comment/new.ejs", { foundCampGround: foundCampGround });
        }
    });

});

//posting new comment

app.post("/campgrounds/:id/comments", isLoggedIn,function (req, res) {
    // lookup campground
    //create comment
    // add comment to campground
    //redirect somewhere

    campground.findById(req.params.id, function (err, foundCampGround) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    foundCampGround.comments.push(comment);
                    foundCampGround.save();
                    res.redirect("/campgrounds" + "/" + foundCampGround._id);
                }
            });
        }
    });
});


// ########### Auth routes ############################################################################

//show register form

app.get("/register", function(req, res){
    res.render("register.ejs");
});

// perform sign up

app.post("/register", function(req, res){
    var newUser = new user({ username : req.body.username});

    user.register( newUser, req.body.password, function(err, signedUpUser){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form

app.get("/login" ,function(req, res){
    res.render("login.ejs");
});

//perform login

app.post("/login", passport.authenticate("local", {
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}) ,function(req, res){

});


//logout route

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");

});


//middleware to check whether user is logged in


function isLoggedIn(req, res ,next) {
    
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}

//####################################################################################################

// ############# app listen ####################
app.listen(3000, function () {
    console.log("app started");
});
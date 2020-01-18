var express = require("express");
var router = express.Router();

var passport = require("passport");
var user = require("../models/user");

router.get("/", function (req, res) {
    console.log("this will be landing page");
    res.render("landing.ejs");


});


// ########### Auth routes ############################################################################

//show register form

router.get("/register", function (req, res) {
    res.render("register.ejs", { page: 'register' });
});

// perform sign up

router.post("/register", function (req, res) {
    var newUser = new user({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });

    if (req.body.adminCode === "secretcode123") {
        newUser.isAdmin = true;
    }
    user.register(newUser, req.body.password, function (err, signedUpUser) {
        if (err) {
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp" + signedUpUser.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form

router.get("/login", function (req, res) {
    res.render("login.ejs", { page: 'login' });
});

//perform login

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {

});


//logout route

router.get("/logout", function (req, res) {
    req.flash("success", "Successsfully logged out");
    req.logout();
    res.redirect("/campgrounds");

});

// user profiles

router.get("/users/:id", function(req, res){
    user.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "something went wrong");
            res.redirect("/");

        } else {
            res.render("users/show.ejs", {user : foundUser});
        }
    });
});

module.exports = router;
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

router.get("/register", function(req, res){
    res.render("register.ejs");
});

// perform sign up

router.post("/register", function(req, res){
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

router.get("/login" ,function(req, res){
    res.render("login.ejs");
});

//perform login

router.post("/login", passport.authenticate("local", {
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}) ,function(req, res){

});


//logout route

router.get("/logout", function(req, res){
    req.flash("success", "Successsfully logged out");
    req.logout();
    res.redirect("/campgrounds");

});


module.exports = router;
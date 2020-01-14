var express = require("express");
var router = express.Router();

var campground = require("../models/campground");

router.get("/", function (req, res) {

    // get all campgrounds from db
    console.log(req.user);
    campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log("error");
        }
        else {
            res.render("campground/campgrounds.ejs", { campgrounds: campgrounds });
        }
    });

});

router.post("/", isLoggedIn , function (req, res) {
    //read data from form and store in campgrounds array

    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    //create a new campground and save to db

    campground.create({
        name: name,
        image: url,
        description: description,
        author : author
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

router.get("/new", isLoggedIn , function (req, res) {
    res.render("campground/new.ejs");
});


router.get("/:id", function (req, res) {
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


function isLoggedIn(req, res ,next) {
    
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}



module.exports = router;
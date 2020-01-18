var express = require("express");
var router = express.Router();

var campground = require("../models/campground");
var middleware = require("../middleware/index");

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

router.post("/", middleware.isLoggedIn, function (req, res) {
    //read data from form and store in campgrounds array

    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    //create a new campground and save to db

    campground.create({
        name: name,
        price : price,
        image: url,
        description: description,
        author: author
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

router.get("/new", middleware.isLoggedIn, function (req, res) {
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


//edit campground route (show form)
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    campground.findById(req.params.id, function (err, foundCampground) {
        res.render("../views/campground/edit.ejs", { campground: foundCampground });
    });
});


//update campground route
router.put("/:id", middleware.checkCampgroundOwnership ,function (req, res) {
    //find and update

    campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});

//delete campground

router.delete("/:id", middleware.checkCampgroundOwnership,function (req, res) {
    campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;
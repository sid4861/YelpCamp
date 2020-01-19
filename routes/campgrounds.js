var express = require("express");
var router = express.Router();
var Review = require("../models/reviews");
var campground = require("../models/campground");
var middleware = require("../middleware/index");
var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dxkeow8zu',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


router.get("/", function (req, res) {
    var noMatch;
    if (req.query.search) {

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        campground.find({ name: regex }, function (err, campgrounds) {
            if (err) {
                console.log("error");
            }
            else {

                if (campgrounds.length < 1) {
                    noMatch = "no campgrounds match that query";
                }
                res.render("campground/campgrounds.ejs", { campgrounds: campgrounds, page: 'campgrounds', noMatch: noMatch });
            }
        });

    } else {

        // get all campgrounds from db
        console.log(req.user);
        campground.find({}, function (err, campgrounds) {
            if (err) {
                console.log("error");
            }
            else {
                res.render("campground/campgrounds.ejs", { campgrounds: campgrounds, page: 'campgrounds', noMatch: noMatch });
            }
        });

    }


});

router.post("/", middleware.isLoggedIn, upload.single('image'), function (req, res) {
    //read data from form and store in campgrounds array

    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    //image upload code

    cloudinary.uploader.upload(req.file.path, function (result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.image = result.secure_url;

        //create a new campground and save to db

        campground.create({
            name: name,
            price: price,
            image: req.body.image,
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
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campground/new.ejs");
});


router.get("/:id", function (req, res) {
    //find the campground with provided id
    campground.findById(req.params.id).populate("comments likes").populate({
        path: "reviews",
        options: { sort: { createdAt: -1 } }
    }).exec(function (err, campground) {
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
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
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

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            comment.remove({ "_id": { $in: campground.comments } }, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({ "_id": { $in: campground.reviews } }, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});

// campground like route

router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes

        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        })
    })
});

// for fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
// all the middleware go here
var campground = require("../models/campground");
var comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {

    if (req.isAuthenticated()) {
        campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "campground not found");
                res.redirect("/campgrounds");
            } else {
                // does user own campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "permission denied");
                    res.redirect("back");
                }

            }
        });

    } else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error", "comment npt found");
                res.redirect("/campgrounds");
            } else {
                // does user own campground
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "permission denied");
                    res.redirect("back");
                }

            }
        });

    } else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back");
    }

};

middlewareObj.isLoggedIn = function (req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");

};

module.exports = middlewareObj;



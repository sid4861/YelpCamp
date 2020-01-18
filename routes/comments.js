var express = require("express");
var router = express.Router({mergeParams : true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware/index");
//new comment form, nested routes

router.get("/new", middleware.isLoggedIn,function (req, res) {

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

router.post("/", middleware.isLoggedIn,function (req, res) {
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
                    req.flash("error", "something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    foundCampGround.comments.push(comment);
                    foundCampGround.save();
                    req.flasj("error", "comment added successfully");
                    res.redirect("/campgrounds" + "/" + foundCampGround._id);
                }
            });
        }
    });
});

//comment edit - show form
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){

    comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comment/edit.ejs", {campground_id : req.params.id, comment : foundComment});
        }
    });    
});

// comment update

router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


//comment delete
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;
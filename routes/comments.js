var express = require("express");
var router = express.Router({mergeParams : true});
var campground = require("../models/campground");
var comment = require("../models/comment");

//new comment form, nested routes

router.get("/new", isLoggedIn,function (req, res) {

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

router.post("/", isLoggedIn,function (req, res) {
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
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    foundCampGround.comments.push(comment);
                    foundCampGround.save();
                    res.redirect("/campgrounds" + "/" + foundCampGround._id);
                }
            });
        }
    });
});

//comment edit - show form
router.get("/:comment_id/edit", function(req, res){

    comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comment/edit.ejs", {campground_id : req.params.id, comment : foundComment});
        }
    });    
});

// comment update

router.put("/:comment_id", function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


//comment delete
router.delete("/:comment_id", function(req, res){
    comment.findByIdAndRemove();
});
//middleware
function isLoggedIn(req, res ,next) {
    
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}


module.exports = router;
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser : true});

var campground = require("./models/campground");
var comment = require("./models/comment");
var seedDB = require("./seeds");
seedDB();

// campground.create({
//     name : "camp ground5",
//     image : "https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.webp",
//     description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum modi odit alias, quasi facere quo expedita vel quod nobis, corporis exercitationem. Exercitationem est distinctio vitae dignissimos fuga adipisci earum molestiae."

// }, function(err, campground){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("created");
//     }
// });


app.get("/", function (req, res) {
    console.log("this will be landing page");
    res.render("landing.ejs");


});

app.get("/campgrounds", function (req, res) {

    // get all campgrounds from db

    campground.find({}, function(err, campgrounds){
        if(err){
            console.log("error");
        }
        else{
            res.render("campground/campgrounds.ejs", { campgrounds: campgrounds });
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
        name : name,
        image : url,
        description : description
    }, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            console.log("created");
        }
    });

    //redirect back to campgrounds page

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
    res.render("campground/new.ejs");
});


app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided id
    campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            console.log("========");
            console.log(campground);
            res.render("campground/show.ejs", {campground : campground});
        }
    });
});

//new comment form, nested routes

app.get("/campgrounds/:id/comments/new", function(req, res){

    campground.findById(req.params.id, function(err, foundCampGround){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampGround);
            res.render("comment/new.ejs", { foundCampGround : foundCampGround});
        }
    });
    
});

//posting new comment

app.post("/campgrounds/:id/comments", function(req, res){
// lookup campground
//create comment
// add comment to campground
//redirect somewhere

campground.findById(req.params.id, function(err, foundCampGround){
    if(err){
        console.log(err);
        res.redirect("/campgrounds");
    } else{
        comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else{
                foundCampGround.comments.push(comment);
                foundCampGround.save();
                res.redirect("/campgrounds"+"/"+foundCampGround._id);
            }
        });
    }
});
});

app.listen(3000, function () {
    console.log("app started");
});
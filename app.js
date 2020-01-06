var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser : true});

var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description : String
});

var campground = mongoose.model("campground", campgroundSchema);

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
            res.render("campgrounds.ejs", { campgrounds: campgrounds });
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
    res.render("new.ejs");
});


app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided id
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("show.ejs", {campground : campground});
        }
    });
});



app.listen(3000, function () {
    console.log("app started");
});
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var campgrounds = [{ name: "Salmon creek", image: "https://live.staticflickr.com/2476/3768082032_27611a1e91_m.jpg" },
{ name: "Mountain view", image: "https://live.staticflickr.com/5305/5848903262_ae7201d4d7_m.jpg" },
 {name : "camp here", image: "https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.webp"},
 { name: "Salmon creek", image: "https://live.staticflickr.com/2476/3768082032_27611a1e91_m.jpg" },
 { name: "Mountain view", image: "https://live.staticflickr.com/5305/5848903262_ae7201d4d7_m.jpg" },
  {name : "camp here", image: "https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.webp"},
  { name: "Salmon creek", image: "https://live.staticflickr.com/2476/3768082032_27611a1e91_m.jpg" },
  { name: "Mountain view", image: "https://live.staticflickr.com/5305/5848903262_ae7201d4d7_m.jpg" },
   {name : "camp here", image: "https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.webp"},
   { name: "Salmon creek", image: "https://live.staticflickr.com/2476/3768082032_27611a1e91_m.jpg" },
   { name: "Mountain view", image: "https://live.staticflickr.com/5305/5848903262_ae7201d4d7_m.jpg" }];

app.get("/", function (req, res) {
    console.log("this will be landing page");
    res.render("landing.ejs");


});

app.get("/campgrounds", function (req, res) {

    res.render("campgrounds.ejs", { campgrounds: campgrounds });
});

app.post("/campgrounds", function (req, res) {
    //read data from form and store in campgrounds array

    var name = req.body.name;
    var url = req.body.url;

    campgrounds.push({ name: name, image: url });

    //redirect back to campgrounds page

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});

app.listen(3000, function () {
    console.log("app started");
});
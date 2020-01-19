var mongoose = require("mongoose");

var campgroundSchema = mongoose.Schema({
    name: String,
    price : String,
    image: String,
    description: String,
    createdAt : {type : Date, default : Date.now},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ],
    likes:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        }
    ],
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        username : String
    }
});

module.exports = mongoose.model("campground", campgroundSchema);
var mongoose = require("mongoose")

var blogSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    genre:String,
    likes:Number,
    date:{type:Date, default:Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

var blogs = mongoose.model("Blog", blogSchema);

module.exports = blogs;

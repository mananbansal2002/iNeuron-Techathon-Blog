var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    dp:String,
    savedBlogs: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
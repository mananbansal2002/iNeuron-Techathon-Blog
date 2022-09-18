var express = require("express");
var router = express.Router({mergeParams:true});
var blogs = require("../models/blogs");
var comment = require("../models/comment");


router.get("/blogs/:id/comments/new",isLoggedIn, function(req, res) {
    blogs.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {blog:blog});
        }
    })
})

router.post("/blogs/:id/comments",isLoggedIn, function(req, res) {
    blogs.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log("======= blog not available ===========")
            console.log(err);
            console.log("==================")
            res.send(err);
        } else {
            comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                    console.log("creating error")
                    console.log(req.body.commentz)
                    res.send(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log(comment)
                    blogs.comments.push(comment);
                    blogs.save();
                    res.redirect("/blogs/"+blogs._id);
                }
            })
        }
    })
})


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
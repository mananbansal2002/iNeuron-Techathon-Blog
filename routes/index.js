var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Blog = require("../models/blogs");


router.get("/register", function(req, res){
    res.render("register");
})

router.post("/register", function(req, res){
    User.register(new User({username:req.body.username, email:req.body.email, dp:req.body.dp}), req.body.password, function(err,user) {
        if(err) {
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/home");
            })
        }
    })
})

router.get("/login", function(req, res){
    res.render("login");
})

router.post("/addlike/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) console.log("failed to like");
        else {
            foundBlog.likes+=1;
        }
        foundBlog.save();
        res.redirect("show")
    })
})

router.post("/login", passport.authenticate("local", {
    successRedirect:"/home",
    failureRedirect:"/login"
}), function(req, res){
})

router.get("/logout", function(req, res) {
    req.logout(function(err){
        res.redirect("/home");
    });
})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



module.exports = router;
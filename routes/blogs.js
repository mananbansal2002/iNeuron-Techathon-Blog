var express = require("express");
var router = express.Router({mergeParams:true});
var expressSanitizer = require("express-sanitizer");
// router.use(expressSanitizer);

var blogs = require("../models/blogs");

router.get("/", function(req, res) {
    res.redirect("/home");
})

router.get("/home", function(req, res) {
    blogs.find({}, function(err, allBlogs) {
        if(err) {
            console.log("someting went wrong..."+err);
        } else {
            res.render("blogs/index", {blogs:allBlogs});
        }
    })
})

router.post("/blog", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var genre = req.body.genre;
    var likes = 0;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcp = {name:name, image:image, description:desc, author:author, likes:likes, genre:genre};
    blogs.create(newcp, function(err, newBlog){
        if(err) {
            console.log("error in adding new campground..."+err);
        } else{
            console.log("added new campground..."+newBlog);
        }
    });
    res.redirect("/home");
})

router.get("/blog/new", isLoggedIn, function(req, res) {
    res.render("blogs/new");
})

router.get("/blogs/:id", function(req, res) {
    blogs.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
        if(err) {
            console.log("Campground not found!! "+err);
        } else {
            res.render("blogs/show", {blog:foundBlog});
        }
    })
})

router.get("/blogs/:id/edit",isLoggedIn, function(req, res) {
    blogs.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("blogs/edit", {blog:foundBlog});
        }
    })
})

router.put("/blogs/:id",isLoggedIn, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var edited = req.body.blog;
    blogs.findByIdAndUpdate(req.params.id, edited, function(err, updatedBlog){
        if(err) {
            console.log("error in updating....")
            console.log(err)
            res.redirect("/blogs/"+req.params.id+"edit");
        } else {
            if(updatedBlog.author.id.equals(req.user._id))
                res.redirect("/blogs/"+updatedBlog._id);
            else {
                res.send("you don't have permissoin to do that");
            }            
        }
    })
})


router.delete("/blogs/:id",isLoggedIn, function(req, res) {
    if(req.isAuthenticated()) {
        blogs.findById(req.params.id, function(err, foundBlog) {
            if(err) {
                res.redirect("/home");
            } else {
                if(foundBlog.author.id.equals(req.user._id)) {
                    blogs.findByIdAndRemove(req.params.id, function(err) {
                        if(err) {
                            console.log("something went wrong.... " + err);
                            res.send("not deleted...");
                        }else {
                            res.redirect("/home");
                        }
                    })
                }
                else {
                    res.send("Not authorized")
                }
            }
        }) 
    }  
})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnerShip() {

}

module.exports = router;
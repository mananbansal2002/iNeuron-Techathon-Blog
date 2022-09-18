var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    blogs                   = require("./models/blogs"),
    Comment                 = require('./models/comment'),
    // seedDB                  = require("./seed"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override");



var commentRoutes = require("./routes/comments"),
    BlogRoutes = require("./routes/blogs")
    indexRoutes = require("./routes/index")


mongoose.connect("mongodb://localhost/iNeuronblog");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(require("express-session")({
    secret:"Blog page for iNeuron",
    resave:false,
    saveUninitialized:false
}))
app.use(expressSanitizer());
app.use(methodOverride("_method"));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

// seedDB();

app.use(indexRoutes);
app.use(BlogRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
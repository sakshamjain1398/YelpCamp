var  express=require("express"),
	 app=express(),
	 BodyParser=require("body-parser"),
	 mongoose=require("mongoose"),
	 Campground=require("./models/campgrounds"),
	 flash=require("connect-flash"),
	 Comment=require("./models/comment"),
	 LocalStrategy=require("passport-local"),
	 User=require("./models/user"),
	 passport=require("passport"),
	 methodOverride=require("method-override"),
	 seedDB=require("./seeds");

var campgroundRoutes=require("./routes/campgrounds"),
	commentRoutes=require("./routes/comments"),
	indexRoutes=require("./routes/index");

// seedDB();
mongoose.connect("mongodb://localhost/yelpcamp");
app.use(BodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(flash());
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req,res,next) {
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(3000);
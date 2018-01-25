var express=require("express");
var routes=express.Router();
var passport=require("passport");
var User=require("../models/user");

routes.get("/",function (req,res) {
	res.render("landing");
 });

routes.get("/register",function (req,res) {
res.render("register");
});

routes.post("/register",function (req,res) {
	User.register(new User({username:req.body.username}),req.body.password,function (err,user) {
		if(err)
		{
			console.log(err);
			req.flash("error",err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function () {
			res.redirect("/campgrounds");
		});
	});
});

routes.get("/login",function(req,res){
res.render("login");
});

routes.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function (req,res) {
});

routes.get("/logout",function (req,res) {
	req.logout();
	req.flash("success","Successfully Logged Out!!")
	res.redirect("/campgrounds");
});

function isLoggedin(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Log In required!");
	res.redirect("/login");
}
module.exports=routes;
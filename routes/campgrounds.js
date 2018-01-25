var express=require("express");
var routes=express.Router();
var Campground=require("../models/campgrounds");

routes.get("/campgrounds",function (req,res) {
	Campground.find({},function(err,allcampgrounds) {
		if(err)
			console.log(err);
		else
			res.render("campgrounds/index",{campgrounds:allcampgrounds});
	});
 });

routes.post("/campgrounds",isLoggedin,function (req,res) {
var name=req.body.name; 
var img=req.body.imgurl;
var desc=req.body.description;
var author={
	username:req.user.username,
	id:req.user._id
}
Campground.create({name:name, image:img,description:desc,author:author
},function (err,campground) {
	if(err)
	{
		console.log(err);
		res.redirect("/campgrounds");
	}else {
		console.log(campground);
	}
});
req.flash("success","Campground successfully added");
res.redirect("/campgrounds");
});

routes.get("/campgrounds/new",isLoggedin,function (req,res) {
res.render("campgrounds/new");
});

routes.get("/campgrounds/:id",function (req,res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err,campgrounds) {
		if(err)
			console.log(err);
		else{
			res.render("campgrounds/show",{campgrounds:campgrounds});
		}
	});

});

routes.get("/campgrounds/:id/edit",checkUser,function (req,res) {
	Campground.findById(req.params.id,function (err,camp) {
			res.render("campgrounds/edit",{campground:camp});
	});
});

routes.put("/campgrounds/:id",checkUser,function (req,res) {
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,camp) {
			res.redirect("/campgrounds/"+req.params.id);
	})
});

routes.delete("/campgrounds/:id",checkUser,function (req,res) {
	Campground.findByIdAndRemove(req.params.id,function (err) {
		res.redirect("/campgrounds");
	})
});

function isLoggedin(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Log In required!");
	res.redirect("/login");
}

function checkUser(req,res,next) {
	if(req.isAuthenticated())
	{
		Campground.findById(req.params.id,function (err,camp) {
			if(err)
				res.redirect("/campgrounds/"+req.params.id);
			else
			{
				if(camp.author.id.equals(req.user.id))
				{
					next();
				}
				else
					{
						req.flash("error","Permission Denied");
						res.redirect("/campgrounds/"+req.params.id);

					}
			}
		});
	}
	else
		{
			req.flash("error","Log In required")
			res.redirect("/login");
		}
}
module.exports=routes;
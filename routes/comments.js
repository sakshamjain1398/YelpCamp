var express=require("express");
var routes=express.Router();
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");

routes.get("/campgrounds/:id/comments/new",isLoggedin,function (req,res) {
	Campground.findById(req.params.id,function (err,camp) {
		if(err)
			console.log(err)
		else
			res.render("comments/new",{campground:camp});
	});
});

routes.post("/campgrounds/:id/comments",isLoggedin,function (req,res) {
	Campground.findById(req.params.id,function (err,camp){
		if(err)
			console.log(err);
		else
			Comment.create(req.body.comment,function (err,comment) {
				if(err)
					console.log(err)
				else{
					comment.author._id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
				camp.comments.push(comment);
				camp.save();
				res.redirect("/campgrounds/"+req.params.id);
			}
			})
	});
});

routes.get("/campgrounds/:id/comments/:comment_id/edit",checkUser,function (req,res) {
	Comment.findById(req.params.comment_id,function (err,comment) {
		if(err)
			res.redirect("/campgrounds"+req.params.id);
		else
			res.render("comments/edit",{campground_id:req.params.id,comment:comment});
	})
})

routes.put("/campgrounds/:id/comments/:comment_id",checkUser,function (req,res) {
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,newComment) {
		res.redirect("/campgrounds/"+req.params.id);
	});
});

routes.delete("/campgrounds/:id/comments/:comment_id",checkUser,function (req,res) {
	Comment.findByIdAndRemove(req.params.comment_id,function (err,RemovedComment) {
		res.redirect("/campgrounds/"+req.params.id);
	});
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
		Comment.findById(req.params.comment_id,function (err,comment) {
			if(err)
				res.redirect("/campgrounds/"+req.params.id);
			else
			{
				if(comment.author.username==req.user.username)
				{
					next();
				}
				else
					res.redirect("/campgrounds/"+req.params.id);
			}
		});
	}
	else
		res.redirect("/campgrounds/"+req.params.id);
}

module.exports=routes;
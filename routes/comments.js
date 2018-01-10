var express = require("express");
var router  = express.Router();
var Blog    = require("../models/blog");
var Comment = require("../models/comment");

// COMMENT NEW ROUTE
router.get("/blogs/:id/comments/new", function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {blog: blog, currentUser: req.user});
		}
	});
	
	// res.render("commnets/new", {blogId: req.params.id, currentUser: req.user});
});

// for some reason the comment is working, but not associated with the blog model
router.post("/blogs/:id/comments", function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		} else {
			Comment.create(req.body.comments, function(err, comments){
				if(err){
					console.log(err);
				} else {
					blog.comments.push(comments);
					blog.save(function(err){
						if(err) {
							console.log(err);
							res.redict("/blogs/" + blog._id);
						} else {
							console.log(blog);
							res.redirect("/blogs/" + blog._id);
						}
					});
				}
			});
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

// something about this is working but erroring - need to fix
function isNotLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		res.redirect("/blogs");
	}
	return next();
}

module.exports = router;
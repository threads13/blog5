var express = require("express");
var router  = express.Router({mergeParams: true});
var Blog    = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENT NEW ROUTE
router.get("/new", function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {blog: blog, currentUser: req.user});
		}
	});
});

router.post("/", function(req, res){
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

module.exports = router;
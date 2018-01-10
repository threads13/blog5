var express = require("express");
var router  = express.Router();
var Blog    = require("../models/blog");

// INDEX Route
router.get("/blogs", function(req, res){
	Blog.find({}).sort([['posted', -1]]).exec(function(err, docs) {
		// console.log(docs);
		res.render("blog/index", {blogs: docs, currentUser: req.user});
			// Blog.find({}, function(err, blogs){
			// 	if(err){
			// 		console.log(err);
			// 	} else {
			// 		res.render("index", {blogs: blogs});
			// 	}
		// });
	});
});

// NEW ROUTE
router.get("/blogs/new", isLoggedIn, function(req, res){
	res.render("blog/new", {currentUser: req.user});
});

// CREATE ROUTE
router.post("/blogs", function(req, res){
	// create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("blog/new");
		} else {
			res.redirect("/blogs");
		}
	});
	// redirect
});

// need to set up the show route properly -  the else statement is finding an author in a silly way
// that is likely from me trying
// SHOW ROUTE
router.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {

				res.render("blog/show", {blog: foundBlog, currentUser: req.user});

		}
	});
});

// EDIT ROUTE
router.get("/blogs/:id/edit", isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) {
			res.rediret("blog/index");
		} else {
			res.render("blog/edit", {blog: foundBlog, currentUser: req.user});
		}
	});
});

// UPDATE ROUTE
router.put("/blogs/:id", isLoggedIn, function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DESTROY
router.delete("/blogs/:id", isLoggedIn, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

router.get("/test", function(req, res){
	res.render("blog/test2");

});


Blog.find({}).sort([['posted', -1]]).exec(function(err, docs) {
	// console.log(docs);

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
var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

// LANDING PAGE
router.get("/", function(req, res){
	res.render("landing");
});
// AUTH ROUTES

// nee do sed up functionality to stop the reister page if not logged in
router.get("/register", middleware.isNotLoggedIn, function(req, res){
	res.render("blog/register", {currentUser: req.user});
});

// HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("blog/register");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs");
		});
	});
});

// SHOW LOGIN FORM
router.get("/login", middleware.isNotLoggedIn, function(req, res){
	res.render("blog/login", {currentUser: req.user});
});

router.post("/login", passport.authenticate("local", 
	{	successRedirect: "/blogs",
		failureRedirect: "/login"
	}), function(req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/blogs");
})
module.exports = router;
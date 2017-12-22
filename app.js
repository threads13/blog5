const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

// APP CONFIG
mongoose.connect("mongodb://localhost/jacob_blog2");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Wise men say only fools rush in",
	resave: false,
	saveUnitialize: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// SCHEMA SETUP
var blogSchema = new mongoose.Schema({
    author: String,
    title: String,
    desc: String,
    posted: {type: Date, default: Date.now()} 
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	author: "Jacob",
// 	title: "Test data",
// 	desc: "Here is some dummy data"
// });

// ROUTES
// LANDING PAGE
app.get("/", function(req, res){
	res.render("landing");
});

// INDEX Route
app.get("/blogs", function(req, res){
	Blog.find({}).sort([['posted', -1]]).exec(function(err, docs) {
		// console.log(docs);
		res.render("index", {blogs: docs, currentUser: req.user});
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
app.get("/blogs/new", isLoggedIn, function(req, res){
	res.render("new", {currentUser: req.user});
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
	// create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
	// redirect
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog, currentUser: req.user});
		}
	});
});

// EDIT ROUTE
app.get("/blogs/:id/edit", isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) {
			res.rediret("index");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", isLoggedIn, function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DESTROY
app.delete("/blogs/:id", isLoggedIn, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.get("/test", function(req, res){
	res.send("test");
	console.log(Blog.sort(function(a, b) {
 		 return (new Date(b.posted)) - (new Date(a.posted))
	}));
});

// var Point = [{

//   "id": 1,
//   "name": "A",
//   "LastUpdate": "2016-07-08",
//   "position": [36.8479648, 10.2793332]
// }, {
//   "id": 20,
//   "name": "A",
//   "LastUpdate": "2016-07-07",
//   "position": [36.8791039, 10.2656209]
// }, {
//   "id": 3,
//   "name": "A",
//   "LastUpdate": "2016-07-09",
//   "position": [36.9922751, 10.1255164]
// }, {
//   "id": 4,
//   "name": "A",
//   "LastUpdate": "2016-07-10",
//   "position": [36.9009882, 10.3009531]
// }, {
//   "id": 50,
//   "name": "A",
//   "LastUpdate": "2016-07-04",
//   "position": [37.2732415, 9.8713665]
// }];

// console.log(Point.sort(function(a, b) {
//   return (new Date(b.LastUpdate)) - (new Date(a.LastUpdate))
// }))

// Blog.find().sort([['posted', 'descending']]).all(function (posts) {
//   console.log(posts);
// });

Blog.find({}).sort([['posted', -1]]).exec(function(err, docs) {
	// console.log(docs);

});

// AUTH ROUTES

// nee do sed up functionality to stop the reister page if not logged in
app.get("/register", isNotLoggedIn, function(req, res){
	res.render("register", {currentUser: req.user});
});

// HANDLE SIGN UP LOGIC
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs");
			// need to research what this logis is all about by looking at previous video
		});
	});
});

// SHOW LOGIN FORM
app.get("/login", isNotLoggedIn, function(req, res){
	res.render("login", {currentUser: req.user});
});

app.post("/login", passport.authenticate("local", 
	{	successRedirect: "/blogs",
		failureRedirect: "/login"
	}), function(req, res){
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/blogs");
})

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

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
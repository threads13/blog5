const http = require('http');
const hostname = '127.0.0.1';
const PORT = process.env.PORT || 5000

// const port = 3000;

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var Comment = require("./models/comment");
var Blog = require("./models/blog");

// APP CONFIG
// mongoose.connect("mongodb://localhost/jacob_blog2");

mongoose.connect("mongodb://lefty:pass@ds135777.mlab.com:35777/jacobblog");
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
// var blogSchema = new mongoose.Schema({
//     author: String,
//     title: String,
//     desc: String,
//     posted: {type: Date, default: Date.now()},
//     comments: [
//     	{
//     		type: mongoose.Schema.Types.ObjectId,
//     		ref: "Comment"
//     	}
//     ] 
// });
// ;

// ROUTES
// LANDING PAGE
app.get("/", function(req, res){
	res.render("landing");
});

// INDEX Route
app.get("/blogs", function(req, res){
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
app.get("/blogs/new", isLoggedIn, function(req, res){
	res.render("blog/new", {currentUser: req.user});
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
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

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("blog/show", {blog: foundBlog, currentUser: req.user});
		}
	});
});

// EDIT ROUTE
app.get("/blogs/:id/edit", isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) {
			res.rediret("blog/index");
		} else {
			res.render("blog/edit", {blog: foundBlog, currentUser: req.user});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", isLoggedIn, function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("blog/blogs/" + req.params.id);
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


Blog.find({}).sort([['posted', -1]]).exec(function(err, docs) {
	// console.log(docs);

});

// AUTH ROUTES

// nee do sed up functionality to stop the reister page if not logged in
app.get("/register", isNotLoggedIn, function(req, res){
	res.render("blog/register", {currentUser: req.user});
});

// HANDLE SIGN UP LOGIC
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("blog/register");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs");
			// need to research what this logis is all about by looking at previous video
		});
	});
});

// SHOW LOGIN FORM
app.get("/login", isNotLoggedIn, function(req, res){
	res.render("blog/login", {currentUser: req.user});
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


// COMMENT NEW ROUTE
app.get("/blogs/:id/comments/new", function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {blog: blog});
		}
	});
	
	// res.render("commnets/new", {blogId: req.params.id, currentUser: req.user});
});

// for some reason the comment is working, but not associated with the blog model
// app.post("/blogs/:id/comments", function(req, res){
// 	Blog.findById(req.params.id, function(err, blog){
// 		if(err){
// 			// console.log(err);
// 			res.redirect("/blogs");
// 		} else {
// 			Comment.create(req.body.comment, function(err, comments){
// 				if(err){
// 					console.log(err);
// 				} else {
// 					console.log(comments._id);
// 					blog.comments.push(comments._id);
// 					blog.save();
// 					console.log(blog);
// 					res.redirect("/blogs/" + blog._id);
// 				}
// 			});
// 		}
// 	});
// });

app.get("/blogs/:id/comments", function(req, res){
	var id = mongoose.Types.ObjectId();
	var comment = "Test comments";
	Blog.findById(req.params.id, function(err, blog){
		blog.comments.push(id);
		console.log(blog);
	});
	res.send("Test");
});

// app.listen(process.env.PORT || 5000);
// app.listen(port, function() {
//     console.log('Our app is running on http://localhost:' + port);
// });


// will eventually do this all on one page
// new comment page can mostly duplicate new pots page
//  will need to pass in the post id


		// console.log("data in blogs variable");
		// console.log(blog);

		// 			console.log("data in comment array");
		// 			console.log(comments);

		// 									console.log("data in blogs variable **after push**");
		// 				console.log(comments);
		// 				console.log(blog);


		// 				console.log("data in blogs variable **after save**");
		// 				console.log(blog);
		
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


app.listen(PORT, function() {
    console.log("App is running on port " + PORT);
});

// app.listen(PORT, hostname, () => {
//   console.log(`Server running at http://${hostname}:${PORT}/`);
// });
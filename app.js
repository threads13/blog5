const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

// APP CONFIG
mongoose.connect("mongodb://localhost/jacob_blog2");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});;
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
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
			res.render("show", {blog: foundBlog});
		}
	});
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) {
			res.rediret("index");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DESTROY
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
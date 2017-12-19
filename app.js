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
	Blog.find({}).sort([['posted', -1]]).exec(function(err, docs) {
		console.log(docs);
		res.render("index", {blogs: docs});
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
	console.log(docs);

});

console.log("SECOND TIME RUNNING MY SORT T");


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
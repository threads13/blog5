const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

var express = require("express");
var app = express();

app.set("view engine", "ejs");

// LANDING PAGE
app.get("/", function(req, res){
	res.render("landing");
});

// INDEX Route
app.get("/blogs", function(req, res){
	res.render("blogs");
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
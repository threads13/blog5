const http = require('http');
const hostname = '127.0.0.1';
const PORT = process.env.PORT || 5000

var passportLocalMongoose = require("passport-local-mongoose"), 
           methodOverride = require("method-override"),
            LocalStrategy = require("passport-local"),
                  Comment = require("./models/comment"),
               bodyParser = require("body-parser"),
                     Blog = require("./models/blog"),
                     User = require("./models/user"),
                 mongoose = require("mongoose")
                 passport = require("passport"),
                  express = require("express")
                      app = express();

var commentRoutes = require("./routes/comments");
var blogRoutes    = require("./routes/blogs");
var indexRoutes   = require("./routes/index");

// APP CONFIG
mongoose.connect("mongodb://localhost/jacob_blog2");

// mongoose.connect("mongodb://lefty:pass@ds135777.mlab.com:35777/jacobblog");
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

app.use(commentRoutes);
app.use(blogRoutes);
app.use(indexRoutes);

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
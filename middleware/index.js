var middlewareObj = {};

middlewareObj.isLoggedIn =  function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

// something about this is working but erroring - need to fix
middlewareObj.isNotLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		res.redirect("/blogs");
	}
	return next();
}

module.exports = middlewareObj;
var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    author: String,
    title: String,
    desc: String,
    posted: {type: Date, default: Date.now()},
    comments: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "Comment"
    	}
    ] 
});

module.exports = mongoose.model("Blog", blogSchema);
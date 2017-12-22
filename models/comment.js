var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    author: String,
    desc: String,
    posted: {type: Date, default: Date.now()} 
});

module.exports = mongoose.model("Comment", commentSchema);
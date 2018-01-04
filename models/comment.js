var mongoose = require("mongoose");

// something needs to be rearranged in my comments to make the schemas match
var commentSchema = mongoose.Schema({
    desc: String,
    author: String,
    posted: {type: Date, default: Date.now()}
    // { usePushEach: true }
});

module.exports = mongoose.model("Comment", commentSchema);


// var mongoose = require("mongoose");

// var commentSchema = mongoose.Schema({
//     text: String,
//     author: String
// });

// module.exports = mongoose.model("Comment", commentSchema);

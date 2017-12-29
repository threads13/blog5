var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    author: String,
    title: String,
    desc: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Blog", blogSchema);


// // var blogSchema = mongoose.Schema({
// //     author: String,
// //     title: String,
// //     desc: String,
// //     posted: {type: Date, default: Date.now()},
// //     comments: [
// //     	{
// //     		type: mongoose.Schema.Types.ObjectId,
// //     		ref: "Comment"
// //     	}
// //     ] 
// // });




// var mongoose = require("mongoose");

// var blogSchema = new mongoose.Schema({
//    name: String,
//    image: String,
//    description: String,
//    comments: [
//       {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "Comment"
//       }
//    ]
// });

// module.exports = mongoose.model("Blog", blogSchema);
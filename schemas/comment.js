const mongoose = require("mongoose");

module.exports = mongoose.model("Comment", new mongoose.Schema({
    content: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    editedTime: [Date]
}));

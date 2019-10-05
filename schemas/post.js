const mongoose = require("mongoose");

module.exports = mongoose.model("Post", new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    editedTime: [Date]
}));

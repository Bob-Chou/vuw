const mongoose = require("mongoose");
const user = new mongoose.Schema({
    username: String,
    name: String,
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
})
user.plugin(require("passport-local-mongoose"));

module.exports = mongoose.model("User", user);

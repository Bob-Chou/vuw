const mongoose = require("mongoose"),
      // package to get fake data
      faker    = require("faker"),
      // data model
      User     = require("../schemas/user"),
      Post     = require("../schemas/post"),
      Comment  = require("../schemas/comment");

mongoose.connect("mongodb://localhost/vuw", { useNewUrlParser: true, useUnifiedTopology: true });

// WARNING: DANGEROUS OP!!!!!
// clear up all data
User.remove({}, (err) => {if(err) console.log(err.message);});
Post.remove({}, (err) => {if(err) console.log(err.message);});
Comment.remove({}, (err) => {if(err) console.log(err.message);});

var userNum    = 3,
    postNum    = 3,
    commentNum = 5;

// Using async func so that we could ensure all data is created before association
async function seeding(userNum, postNum, commentNum) {
    var fakeUsers    = [],
        fakePosts    = [],
        fakeComments = [];
    // Creation
    // create fake users
    for (var i = 0; i < userNum; ++i) {
        await User.create({
            username: faker.internet.email(),
            name: faker.name.firstName()
        })
        .then(user => fakeUsers.push(user))
        .catch(err => console.log(err.message));
    }
    // create fake posts
    for (var i = 0; i < postNum; ++i) {
        await Post.create({
            title: faker.lorem.sentence(),
            image: faker.image.imageUrl(640, 480, "", true),
            description: faker.lorem.paragraph(),
            editedTime: [faker.date.recent(5)]
        })
        .then(post => fakePosts.push(post))
        .catch(err => console.log(err.message));
    }
    // create fake comments
    for (var i = 0; i < commentNum; ++i) {
        await Comment.create({
            content: faker.lorem.sentences(),
            editedTime: [faker.date.recent(5)]
        })
        .then(comment => fakeComments.push(comment))
        .catch(err => console.log(err.message));
    }

    // Association
    // Associate each post with a random author
    for (var i = fakePosts.length - 1; i >= 0; i--) {
        // get random author
        var author = fakeUsers[Math.floor((Math.random()*fakeUsers.length))];
        // associate User and Post
        fakePosts[i].author = author;
        author.posts.push(fakePosts[i]);
        // save update
        await fakePosts[i].save().catch(err => console.log(err.message));
        await author.save().catch(err => console.log(err.message));
    }
    // Associate each comment with a random author and a random post
    for (var i = fakeComments.length - 1; i >= 0; i--) {
        // get random author
        var author = fakeUsers[Math.floor((Math.random()*fakeUsers.length))];
        // get random post
        var post = fakePosts[Math.floor((Math.random()*fakePosts.length))];
        // associate User, Post and Comment
        fakeComments[i].author = author;
        author.comments.push(fakeComments[i]);
        post.comments.push(fakeComments[i]);
        // save update
        await fakeComments[i].save().catch(err => console.log(err.message));
        await author.save().catch(err => console.log(err.message));
        await post.save().catch(err => console.log(err.message));
    }
}

seeding(userNum, postNum, commentNum)
.then(() => console.log(`Seeding finished, created:
${userNum} users,
${postNum} posts,
${commentNum} comments

Now you can exit this script!`));


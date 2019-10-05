const express               = require("express"),
      mongoose              = require("mongoose"),
      bodyParser            = require("body-parser"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      // passportLocalMongoose = require("passport-local-mongoose");
      User                  = require("./schemas/user"),
      Post                  = require("./schemas/post"),
      Comment               = require("./schemas/comment");

// Connect to MongoDB
mongoose.connect("mongodb://localhost/vuw", { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// use session for authentication
app.use(require("express-session")({
    secret:"vuw by bob 2019",
    resave: false,
    saveUninitialized: false
}));

// passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// get current user from session and add to local variable
app.use((req, res, next) => {
    res.locals.loggedUser = req.user;
    next();
})
// passport setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// homepage
app.get("/", (req, res) => {
    res.render("home");
});

// sign-up
app.get("/register", (req, res) => {
    res.render("register", {err: null});
});

// save registration back to DB
app.post("/register", (req, res) => {
    User.register(new User({
        username: req.body.username,
        name: req.body.name
    }), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register", {err: err});
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/posts");
        });
    });
});

// login page
app.get("/login", (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.render("login");
}, (req, res) => {
    res.redirect("/posts");
});

// take login action and authetication
app.post("/login", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login"
}));

// logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// posts page
app.get("/posts", (req, res) => {
    Post.find()
    .populate("author")
    .then(posts => {
        posts.sort((a, b) => {
            return b.editedTime[b.editedTime.length - 1] - a.editedTime[a.editedTime.length - 1];
        });
        res.render("collection", {posts: posts, user: req.user})
    })
    .catch(err => console.log(err.message));
})

// save post back to DB
app.post("/posts", (req, res) => {
    Post.create({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        author: req.user,
        editedTime: [Date.now()]
    })
    .then(post => {
        // assign post to its author
        User.findById(req.user._id)
        .then(user => {
            user.posts.push(post);
            user.save();
        })
        .then(res.redirect("/posts"))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err.message));

});

// new post page
app.get("/posts/new", (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}, (req, res) => {
    res.render("new_post");
});

// specific post page
app.get("/posts/:id", (req, res) => {
    var id = req.params.id;
    Post.findOne({_id: id})
    .populate("author")
    .populate({
        path: "comments",
        populate: {path: "author"}
    })
    .then(post => {
        post.comments.sort((a, b) => {
            return b.editedTime[b.editedTime.length - 1] - a.editedTime[a.editedTime.length - 1];
        });
        res.render("post", {post: post, user: req.user})
    })
    .catch(err => console.log(err.message));
})

// new comment page
app.get("/posts/:id/comments/new", (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}, (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        res.render("new_comment", {post: post});
    })
    .catch(err => console.log(err.message));
});

// save comment back to DB
app.post("/posts/:id/comments", (req, res, next) => {
    Comment.create({
        content: req.body.content,
        author: req.user,
        editedTime: [Date.now()]
    })
    .then(comment => {
        // Assign comment to its post
        Post.findById(req.params.id)
        .then(post => {
            post.comments.push(comment);
            post.save();
            comment.post = post;
            comment.save();
            // Assign comment to its author
            User.findById(req.user._id)
            .then(user => {
                user.comments.push(comment);
                user.save();
                res.redirect(`/posts/${post._id}`);
            })
            .catch(err => console.log(err.message));
        })
        .catch(err => console.log(err.message));
    })
    .catch(err => console.log(err.message));
});

// other routes
app.get("*", (req, res) => {
    // When user go to a unexisted page
    res.render("wrong");
})

app.listen(1234, "127.0.0.1", () => {
    console.log("app started!!!")
});



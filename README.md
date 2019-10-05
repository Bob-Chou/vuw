# VUW
Full-stack project: A lovely blog system to share your views.

## Tech Stack
Front end: jQuery, Bootstrap
Back end: Node.js, Express, Passport.js
Database: MongoDB

## Features
Supported features so far:
- [x] Register/Login/Logout
- [x] User authentication
- [x] User specific homepage
- [x] Add posts
- [x] Add comments
- [ ] Edit/Delete posts
- [ ] Edit/Delete comments
- [ ] User profile page

## Routes
route                   | verb     | description
----------------------- | -------- | ------------------------
/home                   | get      | home page
/login                  | get/post | login page
/join                   | get/post | sign up page
/posts                  | get      | all posts sorted by time
/posts                  | post     | add new post
/posts/new              | get      | add new post page
/posts/:id              | get      | specific post
/posts/:id/comments     | get      | all comments under post
/posts/:id/comments     | post     | add new comment
/posts/:id/comments/new | get      | add new comment page
/users/:id              | get      | user profile

## How to deploy on your env
First install deps with `npm`
```shell
npm install
```

Then start the MongoDB
```shell
mongod --dbpath=/path/to/db
```

(optional) Run seed file to generate some user data before starting. 
```shell
node seed/seed.js
```

Last start the server and visit http://127.0.0.1:1234/
```shell
node index.js
```

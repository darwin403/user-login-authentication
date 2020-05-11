var express = require("express");
var router = express.Router();
var createError = require("http-errors");

const { User, Post } = require("../models");
const auth = require("../middlewares/auth");

router.put("/", auth, function (req, res, next) {
  const user = req.user;
  const title = req.body.title;
  const content = req.body.content;

  if (!title || !content)
    return next(createError(400, "Title or content is invalid!"));

  userPosts = user.posts === null ? [] : JSON.parse(user.posts);

  new Post({ title, content, belongs_to: user.id })
    .save()
    .then(post => {
      userPosts.push(post.toJSON().id);
      User.where({ id: parseInt(user.id) })
        .save({ posts: JSON.stringify(userPosts) }, { patch: true })
        .then(function (user) {
          res.send(user);
        })
        .catch(next);
    })
    .catch(next);
});

router.post("/", auth, function (req, res, next) {
  Post.where({ belongs_to: req.user.id })
    .orderBy("id", "DESC")
    .fetchAll()
    .then(posts => {
      res.send(posts);
    })
    .catch(next);
});

router.get("/", function (req, res, next) {
  new Post()
    .orderBy("id", "DESC")
    .fetchAll()
    .then(posts => {
      res.send(posts);
    })
    .catch(next);
});

module.exports = router;

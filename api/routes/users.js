var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var createError = require("http-errors");
const crypto = require("crypto");

const { User } = require("../models");

// show user
router.get("/:token", function (req, res, next) {
  const token = req.params.token || "";
  new User({ token })
    .fetch({ require: false })
    .then(function (result) {
      if (!result) return next(createError(401, "Invalid token!"));
      res.send(result);
    })
    .catch(next);
});

// authenticate user
router.post("/", function (req, res, next) {
  const email = req.body.email || "";
  const password = req.body.password || "";

  new User({ email })
    .fetch({ require: false })
    .then(function (result) {
      if (!result) return next(createError(401, "Email does not exist!"));

      user = result.toJSON();

      if (!bcrypt.compareSync(password, user.password))
        return next(createError(401, "Invalid password!"));

      User.where({ email })
        .save(
          { token: crypto.randomBytes(64).toString("hex") },
          { patch: true }
        )
        .then(function (user) {
          res.send(user);
        })
        .catch(next);
    })
    .catch(next);
});

// register user
router.put("/", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  if (!email || !password || !name)
    return next(createError(400, "Email, password or name is invalid!"));

  new User({ email })
    .fetch({ require: false })
    .then(function (result) {
      if (result) return next(createError(403, "Email already exists!"));

      new User({
        email,
        name,
        password: bcrypt.hashSync(password, 10),
        token: crypto.randomBytes(64).toString("hex"),
      })
        .save()
        .then(function (user) {
          res.send(user);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;

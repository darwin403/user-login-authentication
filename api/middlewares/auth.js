var createError = require("http-errors");
const { User } = require("../models");

function auth(req, res, next) {
  token = req.body.token;

  if (!token) return next(createError(401, "No token provided!"));

  new User({ token })
    .fetch({ require: false })
    .then(function (result) {
      if (!result) return next(createError(401, "Invalid token!"));

      req.user = result.toJSON();
      next();
    })
    .catch(next);
}

module.exports = auth;

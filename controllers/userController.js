const async = require("async");

const Message = require("../models/message");
const User = require("../models/user");

exports.index = (req, res) => {
  async.parallel(
    {
      user_count(callback) {
        User.countDocuments({}, callback);
      },
      message_count(callback) {
        Message.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Members Only Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.user_create_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED");
}

exports.user_create_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED");
}

exports.user_login_get = (req, res, next) => {
 res.send("NOT IMPLEMENTED");
}

exports.user_login_post = (req, res, next) => {
 res.send("NOT IMPLEMENTED");
}

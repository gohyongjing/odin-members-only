const async = require("async");
const { body, validationResult } = require("express-validator");

const Message = require("../models/message");
const User = require("../models/user");

exports.index = (req, res) => {
  async.parallel(
    {
      user_count(callback) {
        User.countDocuments({}, callback);
      },
      messages(callback) {
        if (req.user) {
          Message.find().exec(callback);
        } else {
          Message.find({}, "title text").exec(callback);
        }
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Members Only Home",
        error: err,
        user: req.user,
        data: results,
      });
    }
  );
};

exports.message_create_get = (req, res, next) => {
  if (req.user) {
    res.render("message_form",
      {
        title: "Write Message",
        user: req.user
      });
  } else {
    res.redirect('/user/login');
  }
}

exports.message_create_post = [
    body("title", "Title required")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("text", "Text required")
      .trim()
      .isLength({ min: 1 })
      .escape(),
      (req, res, next) => {
        if (!req.user) {
          res.redirect('/user/login');
        } else {
          const errors = validationResult(req);
          const message = new Message({
            title: req.body.title,
            text: req.body.text,
            timestamp: Date.now(),
            author: req.user._id
          })
          if (!errors.isEmpty()) {
            res.render("message_form",
              {
                title: "Write Message",
                user: req.user,
                message,
                errors: errors.array()
              });
          } else {
            message.save((err) => {
              if (err) {
                return next(err);
              }
              res.redirect('/');
            });
          }
        }
      }
]

exports.message_delete_get = (req, res, next) => {
 res.send("NOT IMPLEMENTED");
}

exports.message_delete_post = (req, res, next) => {
 res.send("NOT IMPLEMENTED");
}

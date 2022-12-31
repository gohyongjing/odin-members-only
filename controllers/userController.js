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
  res.render("user_form", { title: "Create Account" });
};

exports.user_create_post = [
  // Validate and sanitize the fields.
  body("first_name", "First name required")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .bail(),
  body("last_name", "Last name required")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .bail(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email required")
    .bail()
    .isEmail()
    .withMessage("Email not valid")
    .bail()
    .custom(async value => {
      return User.findOne({ email: value }).exec((err, found_email) => {
        return !(err || found_email)
      })
    })
    .withMessage("Email already in use")
    .bail(),
  body("password", "Password of mininimum length 10 required")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .bail(),
  body("confirm_password", "Passwords do not match")
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const user = new User(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("user_form", {
        title: "Create User",
        user,
        errors: errors.array(),
        confirm_password: req.body.confirm_password
      });
    } else {
      // Data from form is valid.
      user.save((err) => {
        if (err) {
          return next(err);
        }
        // user saved. Redirect to login page.
        res.redirect('/user/login');
      });
    }
  },
];

exports.user_login_get = (req, res, next) => {
 res.send("NOT IMPLEMENTED");
};

exports.user_login_post = (req, res, next) => {
 res.send("NOT IMPLEMENTED");
};


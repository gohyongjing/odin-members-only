const async = require("async");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const Message = require("../models/message");
const User = require("../models/user");

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
      let result = await User.findOne({ email: value });
      if (result !== null) {
        return Promise.reject(); // returning false does not work
      return true;
      }
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
 res.render("login_form", { errors: req.session.messages });
};

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/user/login",
  failureMessage: true
});

exports.user_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      res.redirect("/");
    });
  });
};

exports.join_member_get = (req, res, next) => {
  res.render("member_form", { user: req.user });
}

exports.join_member_post = [
  // Validate and sanitize the fields.
  body("secret_code", "Incorrect secret code")
    .trim()
    .escape()
    .equals('catto'),
  // Process request after validation and sanitization.
  (req, res, next) => {
    if (!req.user) {
      res.redirect('/user/login');
    } else {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("member_form", {
          secret_code: req.body.secret_code,
          errors: errors.array(),
          user: req.user
        });
      } else {
        // Data from form is valid.
        User.findByIdAndUpdate(req.user._id, { membership: true }, (err, result) => {
          if (err) {
            return next(err);
          } else {
          res.redirect('/');
          }
        });
      }
    }
  }
];


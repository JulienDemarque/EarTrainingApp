var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Score = require("../models/score");

//------------------- AUTH ROUTES------------------

// show register form
router.get("/register", function(req, res) {
  res.render("register.ejs");
});

//handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, function(err) {
    if (err) {
      console.log(err);
      return res.render("register.ejs");
    }
    //we want to create a empty score that we will update.
    createEmptyScore(req.body.username);
    passport.authenticate("local")(req, res, function() {
      res.redirect("chordnote");
    });
  });
});

function createEmptyScore(username) {
  //Ok this is some weirdness, mongo has converted my empty object literals to null, so I filled them with one bullshit property
  const newResults = {
    level: [
      {
        level: 0
      },
      {
        level: 1
      },
      {
        level: 2
      },
      {
        level: 3
      },
      {
        level: 4
      },
      {
        level: 5
      },
      {
        level: 6
      },
      {
        level: 7
      },
      {
        level: 8
      },
      {
        level: 9
      },
      {
        level: 10
      }
    ]
  };
  var emptyScore = new Score({
    name: username,
    results: newResults
  });
  emptyScore.save(function(err, score) {
    if (err) {
      console.log("something went wrong");
    } else {
      console.log("we saved a new Score to database");
      console.log(score);
    }
  });
}

//show login form
router.get("/login", function(req, res) {
  res.render("login.ejs");
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/chordnote",
    failureRedirect: "/login"
  })
);

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;

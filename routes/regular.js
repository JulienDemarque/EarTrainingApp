var express = require("express");
var router = express.Router();

//----------NORMAL ROUTES -----------------------
router.get("/", function(req, res) {
  res.render("home.ejs");
});

router.get("/chordapp", function(req, res) {
  res.render("chordapp.ejs");
});

router.get("/chordnote", function(req, res) {
  res.render("chordnote.ejs");
});

module.exports = router;

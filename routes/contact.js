var express = require("express");
var router = express.Router();
var handleEmail = require("../infra/email");

//---------------------------CONTACT ROUTES ----------

router.get("/", function(req, res) {
  res.render("contact.ejs");
});

router.get("/confirm", function(req, res) {
  res.render("confirm.ejs");
});

router.post("/", function(req, res) {
  var email = req.body.email;
  var name = req.body.name;
  var comment = req.body.comment;

  handleEmail(email, name, comment);

  res.redirect("/contact/confirm");
});

module.exports = router;

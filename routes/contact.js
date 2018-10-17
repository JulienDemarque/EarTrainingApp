var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");

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

  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    secure: true,
    auth: {
      user: "juliendemarquedev@gmail.com",
      //I use an other environnement variable for the password here
      pass: process.env.EMAILPASSWORD
    }
  });

  var helperOptions = {
    //email options
    from: name + "<" + email + ">",
    to: "Julien Dev <juliendemarquedev@gmail.com>", // receiver
    subject: "Emailing with nodemailer", // subject
    html: "Message from : " + email + "<br/><br/>" + comment // body
  };

  smtpTransport.sendMail(helperOptions, function(error) {
    //callback
    if (error) {
      return console.log(error);
    } else {
      console.log("Message sent: " + res.message);
    }

    smtpTransport.close();
  });

  res.redirect("/contact/confirm");
});

module.exports = router;

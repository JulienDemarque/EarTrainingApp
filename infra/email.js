var nodemailer = require("nodemailer");

//-------  Handle sending nodemailer email from the form --------

function handleEmail(email, name, comment) {
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

  smtpTransport.sendMail(helperOptions, function(error, info) {
    //callback
    if (error) {
      return console.log(error);
    } else {
      console.log("Message sent: ", info.envelope);
    }

    smtpTransport.close();
  });
}

module.exports = handleEmail;

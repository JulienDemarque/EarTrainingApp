/*jslint browser:false */
/*jslint es6 */
"use strict";

//database object serves as a temporary container for updating the database
const database = {
  level: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
};

var express = require("express");
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
// Build the app
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

//-----------DATABASE SETUP-----------------

// Note: test is the default db when we open the mongo shell, I could have created another one
//mongoose.connect("mongodb://localhost/test");
//I should have give an other name than "mydatabase"...
//the URI of the mlab in store in process.env.DATABASEURL in heroku (see settings)

//we use environnement variables eventually
console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL);

var scoreSchema = new mongoose.Schema({
  name: String,
  results: Object
});
var Score = mongoose.model("Score", scoreSchema);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//PASSPORT CONFIGURATION
console.log(process.env.SECRETHASHCODE);
app.use(require("express-session")({
  //We created a environnent variable with same value locally and on heroku for safety.
  secret: process.env.SECRETHASHCODE,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//we are making currentUser variable holding the user data available everywhere on client-side
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


//----------NORMAL ROUTES -----------------------
app.get("/", function(req, res) {
  res.render('home.ejs');
});

app.get("/chordapp", function(req, res) {
  res.render('chordapp.ejs');
});

app.get("/chordnote", function(req, res) {
  res.render('chordnote.ejs');
});

//------------ UPDATE DATABASE ROUTE ------------

//we have the middleware isLoggedIn that will shortcut the callback if we are not login
//another way would be to not send the request at all from client-side
app.post("/chordnote", isLoggedIn, function(req, res) {
  //console.log("line 100 : ", req.user);
  //console.log(req.body.results);
  let dataFromClient = req.body.results;
  /* Note: the Date will return the local time of the server!
  We can probably fix that by sending the time from client side to in the request... */
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();
  let fullDate = "" + date + "-" + month + "-" + year;
  //We are about to connect to database and retrive the user results...
  Score.find({
    "name": req.user.username
  }, function(err, score) {
    if (err) {
      console.log("something went wrong in the update");
    } else {
      console.log(score);
      //we get an array of found documents, even if there is only one (hopefully!)
      console.log("Find on mongodb line 97 : ", score[0].results.level);
      database.level = score[0].results.level;
      updateDatabase(req.user.username);

    }
  });

  function updateDatabase(username) {
    dataFromClient.forEach(function(result) {
      //If we don't have result for this date we create the object for today
      if (database.level[result.level][fullDate] === undefined) {
        if (result.success) {
          database.level[result.level][fullDate] = {
            rightAnswers: 1,
            wrongAnswers: 0
          };
        } else {
          database.level[result.level][fullDate] = {
            rightAnswers: 0,
            wrongAnswers: 1
          };
        }
      } else {
        if (result.success) {
          database.level[result.level][fullDate].rightAnswers += 1;
        } else {
          database.level[result.level][fullDate].wrongAnswers += 1;
        }
      }
    });

    //we modified our database object, now we put it in the mongo db
    Score.findOneAndUpdate({
      "name": username
    }, {
      $set: {
        "results": database
      }
    }, {
      new: true
    }, function(err, user) {
      if (err) {
        console.log("something went wrong in the update");
      } else {
        console.log(user);
      }
    });
  }

  //console.log(database.level[0][fullDate]);
  res.send("got it");
});

//----------------------------------------------
/* Route for sending json for the d3 graph */
app.get("/graph", isLoggedIn, function(req, res) {
  let myJson;
  //fetching data from database:
  Score.find({
    "name": req.user.username
  }, function(err, score) {
    if (err) {
      console.log("something went wrong in the update");
    } else {
      //we get an array of found documents, even if there is only one (hopefully!)
      console.log("Find on mongodb line 97 : ", score[0].results.level);
      myJson = score[0].results.level;
    }
    res.json(myJson);
  });
});

//------------------- AUTH ROUTES------------------

// show register form
app.get("/register", function(req, res) {
  res.render("register.ejs");
});

//handle sign up logic
app.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, function(err, user) {
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
    level: [{
      level: 0
    }, {
      level: 1
    }, {
      level: 2
    }, {
      level: 3
    }, {
      level: 4
    }, {
      level: 5
    }, {
      level: 6
    }, {
      level: 7
    }, {
      level: 8
    }, {
      level: 9
    }, {
      level: 10
    }]
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
app.get("/login", function(req, res) {
  res.render("login.ejs");
});

//handling login logic
app.post("/login", passport.authenticate("local", {
  successRedirect: "/chordnote",
  failureRedirect: "/login"
}), function(req, res) {});

// logout route
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

//------------- MIDDLEWARE --------------
// this is a custom middleware. We don't want to try to get to the database if the user is not login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send("need to login for saving data");
}

//---------------------------CONTACT ROUTES ----------

app.get("/contact", function(req, res) {
  res.render('contact.ejs');
});

app.get("/confirm", function(req, res) {
  res.render('confirm.ejs');
});

app.post("/contact", function(req, res) {
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

  smtpTransport.sendMail(helperOptions, function(error, info) { //callback
    if (error) {
      return console.log(error);
    } else {
      console.log("Message sent: " + res.message);
    }

    smtpTransport.close();
  });

  res.redirect("/confirm");
});



app.listen(process.env.PORT || 8080, process.env.IP, function() {
  console.log("server started");
});

/*jslint browser:false */
/*jslint es6 */
"use strict";

var express = require("express");
var bodyParser = require("body-parser");
// Build the app
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

var authRoutes = require("./routes/auth");
var contactRoutes = require("./routes/contact");
var graphRoutes = require("./routes/graph");
var databaseRoute = require("./routes/database");
var regularRoutes = require("./routes/regular");

//-----------DATABASE SETUP-----------------

console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));

//PASSPORT CONFIGURATION
console.log(process.env.SECRETHASHCODE);
app.use(
  require("express-session")({
    //We created a environnent variable with same value locally and on heroku for safety.
    secret: process.env.SECRETHASHCODE,
    resave: false,
    saveUninitialized: false
  })
);
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

//requiring routes
app.use("/", authRoutes);
app.use("/", regularRoutes);
app.use("/contact", contactRoutes);
app.use("/graph", graphRoutes);
app.use("/chordnote", databaseRoute);

app.listen(process.env.PORT || 8080, process.env.IP, function() {
  console.log("server started");
});

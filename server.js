/*jslint browser:false */
/*jslint es6 */
"use strict";
// Require the stuff we need
//-----------DATABASE SETUP-----------------
var mongoose = require("mongoose");
// Note: test is the default db when we open the mongo shell, I could have created another one
//we want to use environnement variables eventually
mongoose.connect("mongodb://localhost/test");
var userSchema = new mongoose.Schema({
  name: String,
  results: Object
});
var User = mongoose.model("User", userSchema);
//for now we will create just myTestUser...
/*
const results = {level : [
  {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
]};
var myTestUser = new User({
  name: "MyTestUser",
  results: results
});
myTestUser.save(function(err, user){
    if(err){
      console.log("something went wrong");
    } else {
      console.log("we saved a user to database");
      console.log(user);
    }
});

User.findOneAndUpdate({"name": "MyTestUser"}, {$set:{"results": results}}, {new: true}, function(err, user){
  if(err){
    console.log("something went wrong in the update");
  } else {
    console.log(user);
  }
});

User.find({"name": "MyTestUser"}, function(err, user){
  if(err){
    console.log("something went wrong in the update");
  } else {
    console.log("From mongodb : ", user[0].results);
  }
}); */

const database = {level : [
  {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
]};
//------------End of DATABASE SETUP---------

var express = require("express");
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var http = require("http");
// Build the app
var app = express();
//we are now storing the data in a database object, we want to change it into a real database


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render('home.ejs');
});

app.get("/chordapp", function(req, res) {
  res.render('chordapp.ejs');
});

app.get("/chordnote", function(req, res) {
  res.render('chordnote.ejs');
});


app.post("/chordnote", function(req, res){
  console.log(req.body.results);
  let dataFromClient = req.body.results;
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();
  let fullDate = "" + date + "-"+ month + "-"+ year;
  //We are about to connect to database and retrive the user results...
  User.find({"name": "MyTestUser"}, function(err, user){
    if(err){
      console.log("something went wrong in the update");
    } else {
      console.log("From mongodb : ", user[0].results);
      database.level = user[0].results.level;
      updateDatabase();
    }
  });
  //console.log(fullDate);
  function updateDatabase(){
    dataFromClient.forEach(function(result){
      //If we don't have result for this date we create the object for today
      if(database.level[result.level][fullDate] === undefined){
        if(result.success){
          database.level[result.level][fullDate] = {rightAnswers : 1, wrongAnswers: 0};
        } else {
          database.level[result.level][fullDate] = {rightAnswers : 0, wrongAnswers: 1};
        }
      } else {
        if(result.success){
          database.level[result.level][fullDate].rightAnswers += 1;
        } else {
          database.level[result.level][fullDate].wrongAnswers += 1;
        }
      }
    });

    //we modified our database object, now we put it in the mongo
    User.findOneAndUpdate({"name": "MyTestUser"}, {$set:{"results": database}}, {new: true}, function(err, user){
      if(err){
        console.log("something went wrong in the update");
      } else {
        console.log(user);
      }
    });
  }


  //console.log(database.level[0][fullDate]);
  res.send("got it");
});

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
       pass: "demar0241"
       }
   	});



	var helperOptions= {
		//email options
	   from: name + "<" + email + ">",
	   to: "Julien Dev <juliendemarquedev@gmail.com>", // receiver
	   subject: "Emailing with nodemailer", // subject
	   html: "Message from : " + email + "<br/><br/>" + comment // body
	};

	 smtpTransport.sendMail(helperOptions, function(error, info){  //callback
	        if(error){
	           return console.log(error);
	        }else{
	           console.log("Message sent: " + res.message);
	       }

	  smtpTransport.close();
	    });

    res.redirect("/confirm");
});

/*http.createServer(app).listen(8080, function(){
	console.log("server running");
});*/

app.listen(process.env.PORT || 8080, process.env.IP, function(){
    console.log("server started");
});

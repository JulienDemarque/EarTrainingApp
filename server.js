
// Require the stuff we need
var express = require("express");
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var http = require("http");
// Build the app
var app = express();
//we are now storing the data in a database object, we want to change it into a real database
const database = {level : [
  {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
]};
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
  //console.log(fullDate);
  dataFromClient.forEach(function(result){
    //If we don't have result for this date we create the object for today
    if(database.level[result.level][fullDate] === undefined){
      if(result.success){
        database.level[result.level] = {[fullDate]: {rightAnswers : 1, wrongAnswers: 0}}
      } else {
        database.level[result.level] = {[fullDate]: {rightAnswers : 0, wrongAnswers: 1}}
      }
    } else {
      if(result.success){
        database.level[result.level][fullDate].rightAnswers += 1;
      } else {
        database.level[result.level][fullDate].wrongAnswers += 1;
      }
    }
  })

  console.log(database.level[0][fullDate]);

})

app.get("/contact", function(req, res) {
  res.render('contact.ejs');
});

app.get("/confirm", function(req, res) {
  res.render('confirm.ejs');
});

app.post("/contact", function(req, res) {
	var email = req.body.email;
	var name = req.body.name;
	var comment= req.body.comment;

	var smtpTransport  = nodemailer.createTransport({
       service: "Gmail",
       secure: true,
       auth: {
       user: "juliendemarquedev@gmail.com",
       pass: "demar0241"
       }
   	});



	var helperOptions= {
		//email options
	   from: name + "<" + email +">",
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
    console.log("server started")
});

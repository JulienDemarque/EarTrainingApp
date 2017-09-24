
// Require the stuff we need
var express = require("express");
var http = require("http");
// Build the app
var app = express();

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render('home.ejs');
});

app.get("/chordapp", function(req, res) {
  res.render('index.ejs');
});

/*http.createServer(app).listen(8080, function(){
	console.log("server running");
});*/

app.listen(process.env.PORT || 8080, process.env.IP, function(){
    console.log("server started")
});
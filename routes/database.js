var express = require("express");
var router = express.Router();
var isLoggedIn = require("../middleware/index");
var dblogic = require("../infra/dblogic");

//database object serves as a temporary container for updating the database
const database = {
  level: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
};

//------------ UPDATE DATABASE ROUTE ------------

//we have the middleware isLoggedIn that will shortcut the callback if we are not login
//another way would be to not send the request at all from client-side
router.post("/", isLoggedIn, function(req, res) {
  let dataFromClient = req.body.results;

  //We are about to connect to database and retrive the user results...
  let username = req.user.username;

  dblogic.getUserResults(username, callBackGetUserResults);

  function callBackGetUserResults(results) {
    database.level = results;
    dblogic.updateDatabase(req.user.username, dataFromClient, database);
  }

  res.send("got it");
});

module.exports = router;

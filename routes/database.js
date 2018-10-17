var express = require("express");
var router = express.Router();
var isLoggedIn = require("../middleware/index");
var Score = require("../models/score");

//database object serves as a temporary container for updating the database
const database = {
  level: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
};

//------------ UPDATE DATABASE ROUTE ------------

//we have the middleware isLoggedIn that will shortcut the callback if we are not login
//another way would be to not send the request at all from client-side
router.post("/", isLoggedIn, function(req, res) {
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
  Score.find(
    {
      name: req.user.username
    },
    function(err, score) {
      if (err) {
        console.log("something went wrong in the update");
      } else {
        console.log(score);
        //we get an array of found documents, even if there is only one (hopefully!)
        console.log("Find on mongodb line 97 : ", score[0].results.level);
        database.level = score[0].results.level;
        updateDatabase(req.user.username);
      }
    }
  );

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
    Score.findOneAndUpdate(
      {
        name: username
      },
      {
        $set: {
          results: database
        }
      },
      {
        new: true
      },
      function(err, user) {
        if (err) {
          console.log("something went wrong in the update");
        } else {
          console.log(user);
        }
      }
    );
  }

  //console.log(database.level[0][fullDate]);
  res.send("got it");
});

module.exports = router;

var Score = require("../models/score");

function getUserResults(username, callback) {
  Score.find(
    {
      name: username
    },
    function(err, score) {
      if (err) {
        console.log("something went wrong in the update");
      } else {
        console.log(score);
        //we get an array of found documents, even if there is only one (hopefully!)
        console.log("Find on mongodb line 97 : ", score[0].results.level);
        var results = score[0].results.level;
        callback(results);
      }
    }
  );
}

function updateDatabase(username, dataFromClient, temporaryDatabase) {
  /* Note: the Date will return the local time of the server */
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();
  console.log("hour: ", today.getHours());
  let fullDate = "" + date + "-" + month + "-" + year;

  dataFromClient.forEach(function(result) {
    //If we don't have result for this date we create the object for today
    if (temporaryDatabase.level[result.level][fullDate] === undefined) {
      if (result.success) {
        temporaryDatabase.level[result.level][fullDate] = {
          rightAnswers: 1,
          wrongAnswers: 0
        };
      } else {
        temporaryDatabase.level[result.level][fullDate] = {
          rightAnswers: 0,
          wrongAnswers: 1
        };
      }
    } else {
      if (result.success) {
        temporaryDatabase.level[result.level][fullDate].rightAnswers += 1;
      } else {
        temporaryDatabase.level[result.level][fullDate].wrongAnswers += 1;
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
        results: temporaryDatabase
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

module.exports.getUserResults = getUserResults;
module.exports.updateDatabase = updateDatabase;

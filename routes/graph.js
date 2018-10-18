var express = require("express");
var router = express.Router();
var isLoggedIn = require("../middleware/index");
var Score = require("../models/score");

//----------------------------------------------
/* Route for sending json for the d3 graph */
router.get("/", isLoggedIn, function(req, res) {
  let myJson;
  //fetching data from database:
  Score.find(
    {
      name: req.user.username
    },
    function(err, score) {
      if (err) {
        console.log("something went wrong in the update");
      } else {
        myJson = score[0].results.level;
      }
      res.json(myJson);
    }
  );
});

module.exports = router;

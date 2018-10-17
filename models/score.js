var mongoose = require("mongoose");

var scoreSchema = new mongoose.Schema({
  name: String,
  results: Object
});

module.exports = mongoose.model("Score", scoreSchema);

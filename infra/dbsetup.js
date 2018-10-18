var config = require("./config");

function connectToDB() {
  var mongoose = require("mongoose");
  console.log(config);

  //-----------DATABASE SETUP-----------------

  console.log(config.getDatabaseUrl());
  mongoose.connect(config.getDatabaseUrl());
}

module.exports = connectToDB;

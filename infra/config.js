function getDatabaseUrl() {
  if (process.env.DATABASEURL) {
    return process.env.DATABASEURL;
  }
  console.log(
    "Missing environnent variable for the database. Please add the env variable and restart the server."
  );
}

module.exports.getDatabaseUrl = getDatabaseUrl;

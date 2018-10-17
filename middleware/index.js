//------------- MIDDLEWARE --------------
// this is a custom middleware. We don't want to try to get to the database if the user is not login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send("need to login for saving data");
}

module.exports = isLoggedIn;

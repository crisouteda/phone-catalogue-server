const jwt = require("jsonwebtoken");

module.exports = {
  isLoggedIn(req, res, next) {
    const token = req.body.token;
    if (!token) {
      res.status(500).json("Sign up to get an authorization token.");
    } else {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(500).json("The authentication failed. Invalid token");
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    }
  },
};

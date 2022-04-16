const jwt = require("jsonwebtoken");

module.exports = {
  isLoggedIn(req, res, next) {
    const token = req.body.token;
    if (!token) {
      res.send("Sign up to get a token");
    } else {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.json({ auth: false, message: "The authentication failed" });
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    }
  },
};

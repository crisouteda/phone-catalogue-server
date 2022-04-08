module.exports = {
  settings(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    next();
    cors({
      origin: ["http://127.0.0.1:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    });
    next();
  },
};

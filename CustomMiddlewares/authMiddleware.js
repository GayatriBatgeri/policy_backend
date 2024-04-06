// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decodedToken = jwt.decode(token, { complete: true });
  console.log(decodedToken);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Error verify :", err);
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };

// jwtMiddleware.js;
const jwt = require("jsonwebtoken");

const Authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  // const decodedToken = jwt.decode(token, { complete: true });

  // Verify the token
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        console.log("Error verify : " + err);
        return res.status(401).json({ message: err });
      }

      req.user = decoded;

      if (decoded && decoded.role) {
        req.userRole = decoded.role;
      } else {
        return res
          .status(401)
          .json({ message: "Unauthorized: No user role found." });
      }

      next();
    }
  );
};

module.exports = { Authenticate };

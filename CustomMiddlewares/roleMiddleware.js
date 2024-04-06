// roleMiddleware.js

const checkUserRole = (req, res, next) => {
  const userRole = req.user ? req.user.role : undefined;

  if (!userRole) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user role found." });
  }

  req.userRole = userRole;

  next();
};

module.exports = { checkUserRole };

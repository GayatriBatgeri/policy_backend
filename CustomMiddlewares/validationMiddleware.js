// middleware/validationMiddleware.js

const { validationResult } = require("express-validator");

function validateInput(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { validateInput };

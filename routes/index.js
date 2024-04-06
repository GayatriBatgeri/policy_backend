// routes/index.js

const express = require("express");
const authRoutes = require("./AuthController");
const userRoutes = require("./UserController");
const adminRoutes = require("./AdminController");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/", userRoutes);
router.use("/admin", adminRoutes);

module.exports = router;

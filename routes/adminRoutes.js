const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const userController = require("../controllers/UserController");
const isAdmin = (req, res, next) => {
  const user = req.user;

  if (user && user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access forbidden. Only admins are allowed." });
  }
};

router.use(isAdmin);
// Admin routes
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.post("/users/create", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/pendings", adminController.getAllPendingReq);
router.put("/requests/:id", adminController.updateRequestStatus);
//policies
router.get("/policies", userController.getAllPOLICIES);
module.exports = router;

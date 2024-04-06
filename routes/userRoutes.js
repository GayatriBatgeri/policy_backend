const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
// Policies related to a particular user
router.post("/createPolicy", userController.createPolicy);
router.get("/getAllPolicies", userController.getAllUserPolicies);
router.get("/policy/:id", userController.getPolicyById);
router.put("/policy/:id", userController.updatePolicy);
router.post("/premiumComplete/:id", userController.completePremium);
router.get("/requests/status", userController.getRequestStatus);
module.exports = router;

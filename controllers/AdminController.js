const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const request = require("../models/RequestModel");
const RequestModel = require("../models/RequestModel");
const UserPolicyModel = require("../models/UserPolicyModel");
// Admin-related operations

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await UserModel.getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await UserModel.createUser(
      username,
      hashedPassword,
      role
    );

    res.json({ message: "User Created Successfully !!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, password, role } = req.body;

  try {
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateUser(userId, username, hashedPassword, role);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await UserPolicyModel.removeFromPolicyShelf(userId);
    const result = await RequestModel.deleteUserRequests(userId);
    await UserModel.deleteUser1(userId);

    console.log(result);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPendingReq = async (req, res) => {
  try {
    const data = await request.getAllRequests();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

const updateRequestStatus = async (req, res) => {
  const USER = req.user.userId;
  const { policy_id, status } = req.body;

  try {
    await RequestModel.completePremium(policy_id, USER);
    await RequestModel.updateRequestStatus(USER, status, policy_id);

    res.json({ message: "Request status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllPendingReq,
  updateRequestStatus,
};

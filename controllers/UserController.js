//controllers/UserController.js
const UserPolicy = require("../models/UserPolicyModel");
const Policy = require("../models/PolicyModel");
const User = require("../models/UserModel");
const RequestModel = require("../models/RequestModel");
const { json } = require("body-parser");

const createPolicy = (req, res) => {
  console.log("Inside  createPolicy !!");
  const {
    policy_number,
    insured_party,
    coverage_type,
    start_date,
    end_date,
    premium_amount,
    status,
  } = req.body;

  Policy.createPolicy({
    policy_number,
    insured_party,
    coverage_type,
    start_date,
    end_date,
    premium_amount,
    status,
  })
    .then((createdPolicy) => {
      console.log(
        "Created Policy ID : " + JSON.stringify(createdPolicy.insertId)
      );

      return UserPolicy.addToPolicyShelf(
        req.user.userId,
        createdPolicy.insertId
      );
      // }
    })

    .then(() => {
      res.json({ message: "Policy created successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

// User can get all policies they added
const getAllUserPolicies = (req, res) => {
  const userId = req.user.userId;
  console.log("Inside getUserPolicies  userId  " + userId);
  Policy.getPoliciesForUser(userId)
    .then((policies) => {
      res.json(policies);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const getAllPOLICIES = (req, res) => {
  console.log("Inside getAllPOLICIES : ");
  Policy.getAllPolicies()
    .then((policies) => {
      res.json(policies);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

// User can get a specific policy they added
const getPolicyById = async (req, res) => {
  const userId = req.user.userId;
  const policyId = req.params.id;
  console.log("Inside geetPolicyById!! with policyId : " + policyId);
  try {
    // Check if there is a mapping between user and policy in user_policies table
    const userPolicyMapping = await Policy.getUserPolicyMapping(
      userId,
      policyId
    );

    if (!userPolicyMapping) {
      return res.status(404).json({ error: "Unauthorized access!!" });
    }

    // If there is a mapping, fetching  policy details
    const policy = await Policy.getPolicyById(policyId);

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updatePolicy = async (req, res) => {
  const policy = req.body;
  const policyId = req.params.id;
  const userId = req.user.userId;
  try {
    const userPolicyMapping = await Policy.getUserPolicyMapping(
      userId,
      policyId
    );

    // If there is no mapping, user doesn't own the policy
    if (!userPolicyMapping) {
      return res
        .status(403)
        .json({ message: "Access forbidden. User doesn't own the policy." });
    }
    await Policy.updatePolicyShelf(policy, policyId);

    return res.json({ message: "Policy shelf updated successfully 😃‼" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const completePremium = async (req, res) => {
  const userId = req.user.userId;
  const policyId = req.params.id;

  try {
    // Check if there is a mapping between user and policy
    const userPolicyMapping = await Policy.getUserPolicyMapping(
      userId,
      policyId
    );

    // If there is no mapping, user doesn't own the policy
    if (!userPolicyMapping) {
      return res
        .status(403)
        .json({ message: "Access forbidden. User doesn't own the policy." });
    }

    // If the user owns the policy, proceed with completing premium
    await RequestModel.completePremium(policyId, userId);
    res.json({
      message: "Complete premium request sent to the admin !!✔",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getRequestStatus = async (req, res) => {
  const userId = req.user.userId;
  try {
    // Retrieve requests with status for the user
    const requests = await RequestModel.getRequestsByUser(userId);

    // Retrieve user policies with notification status
    const userPolicies = await Policy.getPoliciesForUser(userId);

    // Map notification status to requests
    const requestsWithStatus = requests.map((request) => {
      const policyId = request.policy_id;
      const userPolicy = userPolicies.find((up) => up.policy_id === policyId);

      return {
        ...request,
        notification: userPolicy ? userPolicy.notification : null,
      };
    });

    res.json(requestsWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  getAllUserPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  completePremium,
  getRequestStatus,
  getAllPOLICIES,
};

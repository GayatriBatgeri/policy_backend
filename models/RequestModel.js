// models/RequestModel.js

const db = require("../config/database");
const UserPolicyModel = require("./UserPolicyModel");
class RequestModel {
  static createRequest(policy_id, user_id) {
    console.log("policy id =" + policy_id);
    console.log("user id =" + user_id);
    console.log(user_id);
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO requests (user_id, policy_id , created_at) VALUES (?, ?, ?)",
        [user_id, policy_id, new Date()],
        (err, results) => {
          if (err) {
            console.error("Error creating request:", err);
            reject(err);
          } else {
            console.log("Request created successfully:", results);
            resolve(results.insertId);
          }
        }
      );
    });
  }

  static deleteUserRequests(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM requests WHERE user_id = ?",
        [userId],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  // Method to update premium completion status
  static updatePolicyPremiumStatus(policyId, status) {
    return new Promise((resolve, reject) => {
      // Assuming you have a column named 'premium_completed' in the policies table
      if (status === "rejected") {
        db.query(
          "UPDATE policies SET premium_completed = 'NO' WHERE id = ?",
          [policyId],
          (updateErr, result) => {
            if (updateErr) {
              console.error(
                "Error in updating premium completion status:",
                updateErr
              );
              reject(updateErr);
            } else {
              resolve(result);
            }
          }
        );
      } else {
        db.query(
          "UPDATE policies SET premium_completed = 'YES' WHERE id = ?",
          [policyId],
          (updateErr, result) => {
            if (updateErr) {
              console.error(
                "Error in updating premium completion status:",
                updateErr
              );
              reject(updateErr);
            } else {
              resolve(result);
            }
          }
        );
      }
    });
  }

  static updateRequestStatus(userId, status, policyId) {
    this.updatePolicyPremiumStatus(policyId, status.toLowerCase());
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE requests SET status = ? WHERE policy_id = ?",
        [status, policyId],
        async (updateErr, result) => {
          if (updateErr) {
            console.log(`Error in updating request status: ${updateErr}`);
            reject(updateErr);
          } else {
            if (
              status.toLowerCase() === "accepted" ||
              status.toLowerCase() === "rejected"
            ) {
              await UserPolicyModel.updateNotificationStatus(policyId, status);
            }

            resolve(result);
          }
        }
      );
    });
  }

  //premium amt
  static completePremium(policyId, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        await RequestModel.createRequest(policyId, userId);

        resolve();
      } catch (err) {
        console.log("Error in request Model");
        reject(err);
      }
    });
  }

  static getAllRequests() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM requests WHERE status='pending' ",
        (err, results) => {
          if (err) {
            console.error("Error fetching requests:", err);
            reject(err);
          } else {
            // console.log("RESULTS :" + JSON.stringify(results));
            resolve(results);
          }
        }
      );
    });
  }

  static getRequestsByUser(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM requests WHERE user_id = ${userId}  `,
        (err, results) => {
          if (err) {
            console.error("Error fetching requests:", err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }
}

module.exports = RequestModel;

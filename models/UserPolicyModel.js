// models/UserPolicyModel.js

const db = require("../config/database");

class UserPolicyModel {
  static addToPolicyShelf(userId, policyId) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO user_policies (user_id, policy_id) VALUES (?, ?)",
        [userId, policyId],
        (err, results) => {
          if (err) {
            console.error("Error in addToPolicyShelf:", err);
            reject(err);
          } else {
            console.log("Results of addToPolicyShelf:", results);
            console.log(`User Id : ${userId} , policyID : ${policyId}`);
            resolve(true);
          }
        }
      );
    });
  }

  static removeFromPolicyShelf(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM user_policies WHERE user_id = ? ",
        [userId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }
  static updateNotificationStatus(policyId, status) {
    console.log(`policyId = ${policyId} , status = ${status}`);
    return new Promise((resolve, reject) => {
      console.log("Inside updateNotificationStatus ");
      db.query(
        "UPDATE user_policies SET status= ? WHERE  policy_id = ?",
        [status, policyId],
        async (updateErr, result) => {
          if (updateErr) {
            console.log(`Error in updating request status: ${updateErr}`);
            reject(updateErr);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
  static updateRequestStatus(requestId, status) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_policies SET status = ? WHERE request_id = ?",
        [status, requestId],
        async (updateErr, result) => {
          if (updateErr) {
            console.error("Error in updating request status:", updateErr);
            reject(updateErr);
          } else {
            if (status === "accepted" || status === "rejected") {
              await UserPolicyModel.updateNotificationStatus(
                userId,
                policyId,
                status
              );
            }
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = UserPolicyModel;

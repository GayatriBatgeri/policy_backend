// models/PolicyModel.js

const db = require("../config/database");

class PolicyModel {
  static getAllPolicies() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM policies", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static createPolicy(policyData) {
    return new Promise((resolve, reject) => {
      const {
        policy_number,
        insured_party,
        coverage_type,
        start_date,
        end_date,
        premium_amount,
        status,
      } = policyData;
      db.query(
        "INSERT INTO policies (policy_number, insured_party, coverage_type, start_date, end_date, premium_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          policy_number,
          insured_party,
          coverage_type,
          start_date,
          end_date,
          premium_amount,
          status,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static getPoliciesForUser(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT policies.id,policies.policy_number,policies.start_date,policies.end_date,policies.coverage_type,policies.insured_party,policies.premium_amount,policies.status,policies.premium_completed FROM policies INNER JOIN user_policies ON policies.id = user_policies.policy_id WHERE user_policies.user_id = ?",
        [userId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }

  static getPolicyById(policyId) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM policies WHERE id = ?",
        [policyId],
        (err, results) => {
          if (err) reject(err.message);
          resolve(results[0]);
        }
      );
    });
  }

  static updatePolicy(policyId, updatedPolicyData) {
    return new Promise((resolve, reject) => {
      const {
        insured_party,
        coverage_type,
        start_date,
        end_date,
        premium_amount,
        status,
      } = updatedPolicyData;
      db.query(
        "UPDATE policies SET insured_party = ?, coverage_type = ?, start_date = ?, end_date = ?, premium_amount = ?, status = ? WHERE id = ?",
        [
          insured_party,
          coverage_type,
          start_date,
          end_date,
          premium_amount,
          status,
          policyId,
        ],
        (err, results) => {
          if (err) reject(err);
          resolve(policyId);
        }
      );
    });
  }

  static deletePolicy(policyId) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM policies WHERE id = ?", [policyId], (err) => {
        if (err) reject(err);
        resolve(policyId);
      });
    });
  }
  static getUserPolicyMapping(userId, policyId) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM user_policies WHERE user_id = ? AND policy_id = ? LIMIT 1",
        [userId, policyId],
        (err, results) => {
          if (err) {
            console.error("Error in getUserPolicyMapping:", err);
            reject(err);
          } else {
            resolve(results[0]); // Resolve with the first result (if any)
          }
        }
      );
    });
  }
  static updatePolicyShelf(updatedFields, policyId) {
    return new Promise((resolve, reject) => {
      // Fetch existing policy for the user

      db.query(
        "SELECT * FROM policies WHERE id = ? LIMIT 1",
        [policyId],
        (selectErr, existingPolicy) => {
          if (selectErr) {
            reject(selectErr);
            return;
          }
          console.log("EXISTING POLICY : " + existingPolicy);
          if (!existingPolicy || existingPolicy.length === 0) {
            reject(new Error("Policy not found or unauthorized access"));
            return;
          }
          // Extract existing policy fields
          const existingFields = existingPolicy;
          // Identify fields to be updated
          const fieldsToUpdate = {};
          for (const key in updatedFields) {
            fieldsToUpdate[key] = updatedFields[key];
          }
          // Check if there are fields to update
          if (Object.keys(fieldsToUpdate).length === 0) {
            resolve(true); // Nothing to update
            return;
          }

          // Update policy in the policies table
          db.query(
            "UPDATE policies SET ? WHERE id = ?",
            [fieldsToUpdate, policyId],
            (updateErr) => {
              if (updateErr) {
                reject(updateErr);
              } else {
                resolve(true);
              }
            }
          );
        }
      );
    });
  }
}

module.exports = PolicyModel;

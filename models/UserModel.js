// models/UserModel.js

const db = require("../config/database");

class UserModel {
  static createUser(username, password, role = "user") {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, password, role],
        (err, results) => {
          if (err) {
            console.error("Error in createUser:", err);
            reject(err);
          } else {
            console.log("Results of createUser:", results.insertId);
            resolve(results.insertId);
          }
        }
      );
    });
  }

  static getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, results) => {
          if (err) {
            console.error("Error in getUserByUsername:", err);
            reject(err);
          } else {
            // Check if results array is empty
            if (results && results.length > 0) {
              resolve(results[0]);
            } else {
              resolve(null); // Resolve with null if no user found
            }
          }
        }
      );
    });
  }

  static getUserById(userId) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
          // console.log("Errror getUserById : " + err);
          reject(err);
        } else {
          // console.log("ID TO bE DELTEd : " + results[0]);
          resolve(results[0]);
          // console.log(results);
        }
      });
    });
  }

  static updateUser(userId, username, password) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET username = ?, password = ? WHERE id = ?",
        [username, password, userId],
        (err, results) => {
          if (err) reject(err);
          resolve(userId);
        }
      );
    });
  }

  static deleteUser1(userId) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) {
          console.log("EROR INDELETE USER : " + err);
          reject(err);
        } else {
          resolve(userId);
        }
      });
    });
  }
  static getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (err, results) => {
        if (err) reject(err);

        resolve(results);
      });
    });
  }
}

module.exports = UserModel;

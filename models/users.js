const db = require("../db/connection");

exports.selectUsersUsername = () => {
  return db.query(`SELECT username FROM users;`).then((result) => {
    return result.rows;
  });
};

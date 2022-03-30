const { selectUsers, selectUsersUsername } = require("../models/users");

exports.getUsernames = (req, res) => {
  selectUsersUsername().then((usernames) => {
    res.status(200).send(usernames);
  });
};

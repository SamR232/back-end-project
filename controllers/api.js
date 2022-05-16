const { fetchAPI } = require("../models/api");

exports.getAPI = (req, res, next) => {
  fetchAPI()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
};

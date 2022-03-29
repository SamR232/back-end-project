const { selectAllTopics } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  selectAllTopics()
    .then((userTopics) => {
      res.status(200).send({ userTopics });
    })
    .catch((err) => {
      next(err);
    });
};

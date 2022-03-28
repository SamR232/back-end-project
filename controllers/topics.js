const { selectAllTopics } = require("../models/topics");

exports.getTopics = (req, res) => {
  selectAllTopics().then((userTopics) => {
    res.status(200).send({ userTopics });
  });
};

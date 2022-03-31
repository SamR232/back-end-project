const { selectArticleComments } = require("../models/comments");

exports.getArticleComments = (req, res) => {
  let { article_id } = req.params;
  selectArticleComments(article_id).then((comments) => {
    res.status(200).send(comments);
  });
};

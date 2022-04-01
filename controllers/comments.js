const { selectArticleComments } = require("../models/comments");
const { articleIdchecker } = require("../models/utils");

exports.getArticleComments = (req, res, next) => {
  let { article_id } = req.params;

  articleIdchecker(article_id)
    .then((result) => {
      console.log(result);
      return selectArticleComments(article_id);
    })
    .then((comments) => {
      res.status(200).send(comments);
    })

    .catch((err) => {
      next(err);
    });
};

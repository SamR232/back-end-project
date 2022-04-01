const { selectArticleComments, addComment } = require("../models/comments");
const { articleIdchecker } = require("../models/utils");

exports.getArticleComments = (req, res, next) => {
  let { article_id } = req.params;

  articleIdchecker(article_id)
    .then(() => {
      return selectArticleComments(article_id);
    })
    .then((comments) => {
      res.status(200).send(comments);
    })

    .catch((err) => {
      next(err);
    });
};

exports.postArticleComment = (req, res, next) => {
  let { article_id } = req.params;

  addComment(req.body, article_id)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

const {
  selectArticleComments,
  addComment,
  removeArticleComments,
} = require("../models/comments");
const { articleIdChecker, commentIdChecker } = require("../models/utils");

exports.getArticleComments = (req, res, next) => {
  let { article_id } = req.params;

  articleIdChecker(article_id)
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

exports.deleteArticleCommentById = (req, res, next) => {
  let { comment_id } = req.params;

  commentIdChecker(comment_id)
    .then(() => {
      return removeArticleComments(comment_id);
    })
    .then((comments) => {
      res.status(204).send(comments);
    })

    .catch((err) => {
      next(err);
    });
};

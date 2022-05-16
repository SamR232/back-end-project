const {
  selectArticleById,
  updateVotesByArticleId,
  selectAllArticles,
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  let { article_id } = req.params;

  selectArticleById(article_id)
    .then((articleInfo) => {
      res.status(200).send({ articleInfo });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesByArticleId = (req, res, next) => {
  let { article_id } = req.params;
  let { inc_votes } = req.body;

  updateVotesByArticleId(article_id, inc_votes)
    .then((updatedArticleVotes) => {
      res.status(200).send(updatedArticleVotes);
    })
    .catch((err) => {
      next(err);
    });
};

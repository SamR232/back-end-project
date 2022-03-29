const { selectArticleById } = require("../models/articles");

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

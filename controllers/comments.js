const { selectArticleComments } = require("../models/comments");

exports.getArticleComments = (req, res, next) => {
  let { article_id } = req.params;

  selectArticleComments(article_id).then((comments) => {
    res.status(200).send(comments);
  })
  .catch((err)=> {
    next(err)
  })
};

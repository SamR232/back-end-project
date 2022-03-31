const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id = $1
  ;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return { msg: "no comments available" };
      }
      return result.rows;
    });
};

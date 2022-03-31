const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query(
      `SELECT * FROM articles 
    WHERE article_id = $1;`,
      [articleId]
    )
    .then((articleInfo) => {
      if (articleInfo.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return db
          .query(
            "SELECT COUNT(comment_id) FROM comments WHERE article_id = $1",
            [articleId]
          )
          .then((commentCount) => {
            articleInfo.rows[0]["comment_count"] = Number(
              commentCount.rows[0].count
            );
            return articleInfo.rows[0];
          });
      }
    });
};

exports.updateVotesByArticleId = (articleId, inc_votes) => {
  if (!articleId || !inc_votes) {
    return Promise.reject({ status: 400, msg: "No data in object" });
  }

  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [inc_votes, articleId]
    )
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return results.rows[0];
    });
};

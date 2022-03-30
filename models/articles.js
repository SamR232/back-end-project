const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return result.rows[0];
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
      return results.rows[0];
    });
};

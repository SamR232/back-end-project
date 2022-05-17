const db = require("../db/connection");

exports.articleIdChecker = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments for specified article, check article id exists",
        });
      }
    });
};

exports.commentIdChecker = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments for specified comment id, check comment id exists",
        });
      }
    });
};
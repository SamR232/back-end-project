const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  // if (articleId !== typeof Number) {
  //   return Promise.reject({ status: 400, message: "invalid id" });
  // }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((result) => {
      return result.rows[0];
    });
};

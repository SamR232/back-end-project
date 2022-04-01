const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
  let queryStr = "SELECT * FROM comments";
  let queryVal = [];
  //convert to a number?

  if (article_id) {
    queryStr += " WHERE article_id = $1;";
    queryVal.push(article_id);
  }
  return db.query(queryStr, queryVal).then((result) => {
    if (result.rows.length === []) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else {
      return result.rows;
    }
  });
};

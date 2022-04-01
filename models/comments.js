const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
  let queryStr = "SELECT * FROM comments";
  let queryVal = [];

  if (article_id) {
    queryStr += " WHERE article_id = $1;";
    queryVal.push(article_id);
  }
  return db.query(queryStr, queryVal).then((result) => {
    return result.rows;
  });
};

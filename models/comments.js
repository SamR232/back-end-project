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

exports.addComment = (comment, article_id) => {
  const { username, body } = comment;
  article_id = Number(article_id);

  if (typeof body != "string" || typeof username != "string") {
    return Promise.reject({ status: 400, msg: "Invalid data type" });
  } else {
    return db
      .query(
        `INSERT INTO comments
      (body, author, article_id)
    VALUES
    ($1, $2, $3)
       RETURNING *;`,
        [body, username, article_id]
      )
      .then((result) => {
        if (result.rows[0].length === 0) {
          Promise.reject({ status: 404, msg: "username does not exist" });
        }
        return result.rows[0];
      });
  }
};

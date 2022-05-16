const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count
      FROM articles
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [articleId]
    )
    .then((articleInfo) => {
      if (articleInfo.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return articleInfo.rows[0];
      }
    });
};

exports.selectAllArticles = (sort_by, order, topic) => {
  if (!sort_by || sort_by === "date") sort_by = "created_at";

  if (order && !["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Please enter a valid order query",
    });
  }

  if (!order) order = "desc";
  const validColumns = [
    "title",
    "author",
    "article_id",
    "votes",
    "created_at",
    "comment_count",
    "topic",
  ];
  if (sort_by && !validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Please enter a valid sort_by query",
    });
  }

  let propData = [];

  let queryStr = `SELECT articles.*,
  COUNT(comment_id) :: int AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    propData.push(topic);
  }

  if (sort_by) {
    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  } else {
    queryStr += ` GROUP BY articles.article_id ORDER BY created_at ASC;`;
  }

  return db.query(queryStr, propData).then((data) => {
    return data.rows;
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

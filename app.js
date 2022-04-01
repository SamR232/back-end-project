const express = require("express");
const app = express();
app.use(express.json());

//Require in topics
const { getTopics } = require("./controllers/topics");

//Require in articles
const {
  getArticleById,
  patchVotesByArticleId,
  getArticles,
} = require("./controllers/articles");

//Require in comments
const {
  getArticleComments,
  postArticleComment,
} = require("./controllers/comments");

//Require in users
const { getUsernames } = require("./controllers/users");

//Topics
app.get(`/api/topics`, getTopics);

//Articles
app.get(`/api/articles`, getArticles);
app.get(`/api/articles/:article_id`, getArticleById);
app.patch(`/api/articles/:article_id`, patchVotesByArticleId);

//Comments
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postArticleComment);

//Users
app.get("/api/users", getUsernames);

//Error handling
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  const errors = ["22P02"];
  if (errors.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const errors = ["23503"];
  if (errors.includes(err.code)) {
    res.status(404).send({ msg: "username does not exist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "<<< my error");
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;

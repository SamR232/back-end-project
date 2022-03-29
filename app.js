const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/topics");
const { getArticleById } = require("./controllers/articles");

app.get(`/api/topics`, getTopics);
app.get(`/api/users/:article_id`, getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  const errors = ["22P02"];
  if (errors.includes(err.code)) {
    res.status(400).send({ msg: "Invalid id" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message && err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "<<< my error");
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;

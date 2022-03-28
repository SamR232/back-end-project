const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");
app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {}; //Temporary object to store in memory comments

app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || []; //checks if any comments were aready present, associoated with this id. Else assign an empty array.
  comments.push({ id: commentId, content }); //inserts object into comments variable
  commentsByPostId[req.params.id] = comments; // inserts a new comment object inside commentsByPostId as an array

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});

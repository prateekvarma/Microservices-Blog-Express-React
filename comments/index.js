const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {}; //Temporary object to store in memory comments

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || []; //checks if any comments were aready present, associoated with this id. Else assign an empty array.
  comments.push({ id: commentId, content, status: "pending" }); //inserts object into comments variable
  commentsByPostId[req.params.id] = comments; // inserts a new comment object inside commentsByPostId as an array

  //Emit events to event-bus
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content: content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Event received: ", req.body.type);

  const { type, data } = req.body;

  // if the comment has already been checked from the moderation service
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId]; // this is array of comments associated with that particular post, or postId.
    const comment = comments.find((comment) => comment.id === id); //find the comment that needs to be updated
    comment.status = status; //Finally, update the status of the comment, so that the query service is ready to emit data to any service that needs it.

    //At last, emit an event to the event-bus
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        postId,
        content,
        status
      }
    })
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});

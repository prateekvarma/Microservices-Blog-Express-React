const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    //find the particular post
    const post = posts[postId];
    //then push the object in the post array
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    //this starts from the comment service through the EventBus
    const { id, content, postId, status } = data;

    const post = posts[postId]; //search for the particular post
    const comment = post.comments.find((comment) => comment.id === id); //find the particular comment

    comment.status = status; //update the comment's status with thte new status
    comment.content = content; //update content too just in case it's updated too.
  }
}

//Send all posts, because it tracks ALL events
app.get("/posts", (req, res) => {
  res.send(posts);
});

//Receive new events
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  const res = await axios.get("http://localhost:4005/events");

  for(let event of res.data) {
    console.log("Processing event: ", event.type);
    handleEvent(event.type, event.data);
  }
});

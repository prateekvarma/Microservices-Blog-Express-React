const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

//Send all posts, because it tracks ALL events
app.get("/posts", (req, res) => {
  res.send(posts);
});

//Receive new events
app.post("/events", (req, res) => {
  const { type, data } = req.body;

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

  console.log("Console of posts: ", posts);

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});

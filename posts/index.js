const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}; //just a temp object, to act as a memory storage.

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title }; //save the post as a new key-value pair (in memory)

  //create an event, to be passed to the event-bus
  //The schema of the body of this data object can be a flexible format.
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Event received: ", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});

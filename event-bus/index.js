const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

//The SOLO job of this event bus is just to emit events to all sub apps, as soon as it receives an event.

app.post("/events", (req, res) => {
  const event = req.body; // body could be any data - json, string, num. We don't know what because multiple microservices will make POST calls to it.

  //Forward event calls to all sub services
  axios.post("http://localhost:4000/events", event).catch((error) => {
    console.log("4000 error: ", error.message);
  }); //posts service
  axios.post("http://localhost:4001/events", event).catch((error) => {
    console.log("4001 error: ", error.message);
  }); //comments service
  axios.post("http://localhost:4002/events", event).catch((error) => {
    console.log("4002 error: ", error.message);
  }); //Query service

  res.send({ status: "ok" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

//The SOLO job of this event bus is just to emit events to all sub apps, as soon as it receives an event.
//The 2nd job of this event bus now, is to store ALL incoming events in a local variable. Doing this will ensure, that went another microservice goes down, this service can serve them when they're back.

const events = []; //this is the local in memory variable that will store all events.

app.post("/events", (req, res) => {
  const event = req.body; // body could be any data - json, string, num. We don't know what because multiple microservices will make POST calls to it.

  events.push(event); //take every event, and push inside the local store.

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
  axios.post("http://localhost:4003/events", event).catch((error) => {
    console.log("4003 error: ", error.message);
  }); //Moderation service

  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  //whenever anyone requests events from this endpoint, get ALL the events from the local in memory variable.
  res.send(events);
})

app.listen(4005, () => {
  console.log("Listening on 4005");
});

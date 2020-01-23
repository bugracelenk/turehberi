const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("./models/place");
require("./models/profile");
require("./models/user");
require("./models/city");
require("./models/message");

const place_routes = require("./routes/places");
const user_routes = require("./routes/users");
const profile_routes = require("./routes/profiles");
const message_routes = require("./routes/messages");

mongoose
  .connect(
    "mongodb+srv://hllkrtl:1234qwerasdf@cluster0-8smqx.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )//bağlantı yapıyo
  .then(() => console.log("Connected to MongoDB"))//bağlandığını bildiriyo
  .catch(err => console.log(err));//hataları ekrana basıyo
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => { //CORS İzinleri
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/users", user_routes);
app.use("/api/places", place_routes);
app.use("/api/profiles", profile_routes);
app.use("/api/messages", message_routes);

module.exports = app;

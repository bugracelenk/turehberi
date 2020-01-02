const mongoose = require("mongoose");

const message = mongoose.model("Message", new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now()
  }
}));

module.exports = message;
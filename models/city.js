const mongoose = require("mongoose");

const city = mongoose.model("City", new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  plate_code: {
    type: Number,
    required: true
  },
  places: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Place",
    default: []
  }
}));

module.exports = city;
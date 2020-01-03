const mongoose = require("mongoose");

const comment = mongoose.model("Comment", new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
}));

module.exports = comment;
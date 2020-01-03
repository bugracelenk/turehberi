const mongoose = require("mongoose");

const place = mongoose.model("Place", new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    default: 0
  },
  plate_code: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    default: []
  },
  fav_count: {
    type: Number,
    default: 0
  },
  faved_users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Profile",
    default: []
  },
  like_count: {
    type: Number,
    default: 0
  },
  liked_users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Profile",
    default: []
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  published_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile"
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default:[]
  }
}));

module.exports = place;
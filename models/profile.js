const mongoose = require("mongoose");

const profile = mongoose.model("Profile", new mongoose.Schema({
  name: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/
  },
  surname: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/
  },
  username: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  gender: {
    type: String,
    enum: ["Erkek", "Kadın", "Diğer", "Belirtmek İstemiyorum"],
    default: "Belirtmek İstemiyorum"
  },
  batch_type: {
    type: String
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Profile",
    default: []
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Profile",
    default: []
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: []
  },
  user_type: {
    type: String,
    enum: ["normal", "editor", "admin"],
    default: "normal"
  },
  gw_list: {
    gone_list: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Place",
      default: []
    },
    will_go_list: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Place",
      default: []
    }
  },
  liked: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
    default: []
  },
  favs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
    default: []
  }
}));

module.exports = profile;
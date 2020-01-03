const mongoose = require("mongoose");

const profile = mongoose.model(
  "Profile",
  new mongoose.Schema({
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
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    profile_pic: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      enum: ["Erkek", "Kadın", "Diğer", "Belirtmek İstemiyorum"],
      default: "Belirtmek İstemiyorum"
    },
    batch: {
      type: Number,
      default: 0
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
      ref: "Place",
      default: []
    },
    routes: [{
      title: {
        type: String,
        required: true
      },
      route: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Place",
        default: []
      }
    }],
    favs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Place",
      default: []
    },
    messages: [{
      with: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
      },
      chat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }]
    }]
  })
);

module.exports = profile;

const mongoose = require("mongoose");

const user = mongoose.model("User", new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ 
  },
  password: {
    required: true,
    type: String
  },
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}));

module.exports = user;
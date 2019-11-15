const mongoose = require("mongoose");

const theSchema = mongoose.Schema({
  username: {
    type: String,
    min: 3,
    max: 20,
    unique: true,
    required: true
  },
  password: {
    type: String,
    min: 6,
    max: 1024,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  lists: {
    type: Array
  },
  liked_lists: {
    type: Array
  },
  added_videos: {
    type: Array
  },
  history: {
    type: Array
  }
});

module.exports = mongoose.model("users", theSchema);

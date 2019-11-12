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
  api_key: {
    type: String,
    max: 50,
    required: false
  }, 
  lists: {
    type: Array
  },
  saved_lists: {
    type: Array
  },
  saved_songs: {
    type: Array
  }
});

module.exports = mongoose.model("users", theSchema);

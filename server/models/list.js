const mongoose = require("mongoose");

const theSchema = mongoose.Schema({
  name: {
    type: String,
    min: 1,
    required: true
  },
  owner: {
    type: String,
    min: 1,
    required: true
  },
  public: {
    type: Boolean,
    required: true
  },
  videos: {
    type: Array
  },
  favourites: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("lists", theSchema);

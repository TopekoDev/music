const mongoose = require("mongoose");

const theSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  videos: {
    type: Array
  }
});

module.exports = mongoose.model("histories", theSchema);

const mongoose = require("mongoose");

const msgSchema = mongoose.Schema({
    content: {
        type: String,
        min: 1,
        max: 5000,
        required: true
    },
    author: {
        type: String,
        min: 1,
        max: 20,
        required: true
    },
    recipient: {
        type: String,
        min: 1,
        max: 20,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("messages", msgSchema);
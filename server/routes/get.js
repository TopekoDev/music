const express = require("express");
const router = express.Router();
const Message = require("../models/message.js");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_URL
} = process.env

//get messages
router.get("/", async (req, res) => {
    Message
    .find()
    .sort({'date': +1})
    .limit(20)
    .exec(function(err, messages) {
        res.send(messages);
    });
});

module.exports = router;
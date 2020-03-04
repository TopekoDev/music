const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const verify = require("./verify.js");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_DOMAIN
} = process.env;

router.get('/', verify, async (req, res) => {
    //find user and send give data
    User
    .find({"_id": req.user.id})
    .exec(function(err, data) {
        res.send(data);
    });
});

module.exports = router;
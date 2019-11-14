const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const verify = require("./verify.js");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_URL
} = process.env;

router.post('/', verify, async (req, res) => {
    try {
        //pull from db
        await User.findByIdAndUpdate(req.user.id, {$pull: {added_videos: {date: req.body.date}}}, {safe: true});
        //send details
        res.json({"msg":"Removed", "status":"success"});
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;
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
    switch(req.body.type) {
        case 'history':
            try {
                //clear array
                await User.findByIdAndUpdate(req.user.id, {$set: {history: []}}, {safe: true, upsert: true});
                //send details
                res.json({"msg":"Cleared", "status":"success"});
            } catch(error) {
                res.send(error);
            }
            break;
        case 'account':
            try {
                //remove user
                User.findById(req.user.id).remove().exec();
                res.json({"msg":"Removed", "status":"success"});
            } catch(error) {
                res.send(error);
            }
            break;
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const verify = require("./verify.js");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_DOMAIN
} = process.env;

router.post('/', verify, async (req, res) => {
    switch(req.body.type) {
        case 'video':
            try {
                //pull from db
                await User.findByIdAndUpdate(req.user.id, {$pull: {added_videos: {id: req.body.id}}}, {safe: true});
                //send details
                res.json({"msg":"Removed", "status":"success"});
            } catch(error) {
                res.send(error);
            }
            break;
        case 'list':
            try {
                //pull from db
                // videos
                await User.findByIdAndUpdate(req.user.id, {$pull: {added_videos: {list: req.body.id}}}, {safe: true});
                // list
                await User.findByIdAndUpdate(req.user.id, {$pull: {lists: {id: req.body.id}}}, {safe: true});
                console.log("Removed? id: " + req.body.id);
                //send details
                res.json({"msg":"Removed", "status":"success"});
            } catch(error) {
                res.send(error);
            }
            break;
        }
});

module.exports = router;
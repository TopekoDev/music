const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const verify = require("./verify.js");
const mongoose = require("mongoose");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_DOMAIN
} = process.env;

router.post('/', verify, async (req, res) => {
    switch(req.body.type) {
        case 'list':
            try {
                //modify items
                // (if you know better way, please tell me :)
                for(i = 0; i < req.body.items.length; i++) {
                    await User.findByIdAndUpdate(req.user.id, {$pull: {added_videos: {id: req.body.items[i].id}}}, {safe: true});
                    await User.findByIdAndUpdate(req.user.id, {$push: {added_videos: req.body.items[i]}}, {safe: true, upsert: true});
                }
                //send details
                res.json({"msg":"List modified", "status":"success"});
            } catch(error) {
                res.send(error);
            }
            break;
            case 'listname':
                try {
                    //modify list
                    // (if you know better way, please tell me :)
                    await User.findByIdAndUpdate(req.user.id, {$pull: {lists: {id: req.body.id}}}, {safe: true});
                    await User.findByIdAndUpdate(req.user.id, {$push: {lists: {name: req.body.list, id: req.body.id}}}, {safe: true, upsert: true});
                    //send details
                    res.json({"msg":"List modified", "status":"success"});
                } catch(error) {
                    res.send(error);
                }
                break;
    }
});

module.exports = router;
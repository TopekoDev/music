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
        case 'video':
            try {
                var theId = mongoose.Types.ObjectId().toString();
                //get video order
                User
                .find({"_id": req.user.id})
                .exec(async function(err, data) {
                    var theOrder = data[0].added_videos.filter(x => x.list === req.body.list).length+1;
                    //add video to database
                    await User.findByIdAndUpdate(req.user.id, {$push: {added_videos: {video: req.body.video, list: req.body.list, order: theOrder, id: theId}}}, {safe: true, upsert: true});
                    //send details
                    res.json({"msg":"Added video", "status":"success"});
                });
            } catch(error) {
                res.send(error);
            }
            break;
        case 'list':
            try {
                var theId = mongoose.Types.ObjectId().toString();
                //add list to database
                await User.findByIdAndUpdate(req.user.id, {$push: {lists: {name: req.body.list, id: theId}}}, {safe: true, upsert: true});
                //send details
                res.json({"msg":"Added list", "status":"success"});
            } catch(error) {
                res.send(error);
            }
            break;
    }
});

module.exports = router;
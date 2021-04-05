const express = require("express");
const router = express.Router();
const History = require("../models/history.js");
const User = require("../models/user.js");
const verify = require("./verify.js");

router.post('/', verify, async (req, res) => {
    const videoId = req.body.video.id.videoId;
    //increment count value of history entry if it alreayde exists
    History.findOneAndUpdate(
        {
            'user':  req.user.id,
            'videos.video.id.videoId': videoId
        },
        {$inc: {
            'videos.$.count': 1 
        }}
    ).exec(function(err, data) {
        if(err) {
            console.log(err);
        }
        //if history entry was not found, create a new one
        if(data == null) {
            History.findOneAndUpdate({user: req.user.id}, {$push: {videos: {video: req.body.video, count: 1}}}, {safe: true, upsert: true}, function(err) {
                console.log(err);
            });
        }
    });
    //push to recents and limit to 5 items
    User.findByIdAndUpdate(req.user.id, {$push: {recent: {video: req.body.video}}}, {safe: true, upsert: true}).exec(function(err, data) {
        if(err) {
            console.log(err);
        }
        if(data.recent.length >= 5) {
            User.findByIdAndUpdate(req.user.id, {$pop: {recent: -1}}, {safe: true}, function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
    });
});

module.exports = router;
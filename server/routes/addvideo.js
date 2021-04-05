const express = require("express");
const router = express.Router();
const List = require("../models/list.js");
const verify = require("./verify.js");
const mongoose = require("mongoose");

router.post('/', verify, async (req, res) => {
    try {
        //create id for new video
        var theId = mongoose.Types.ObjectId().toString();
        List
        .find({_id: req.body.list})
        .exec(async function(err, data) {
            //set order for new video
            var theOrder = data[0].videos.length+1;
            //add video to database
            await List.findOneAndUpdate({_id: req.body.list, owner: req.user.id}, {$push: {videos: {video: req.body.video, order: theOrder, id: theId}}}, {safe: true, upsert: true});
            res.send("success");
        });
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;
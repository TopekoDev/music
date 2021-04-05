const express = require("express");
const router = express.Router();
const List = require("../models/list.js");
const verify = require("./verify.js");

router.post('/', verify, async (req, res) => {
    try {
        //pull video from list
        await List.findOneAndUpdate({_id: req.body.list, owner: req.user.id}, {$pull: {videos: {id: req.body.video}}}, {safe: true});
        res.send("success");
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;
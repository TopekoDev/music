const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const List = require("../models/list.js");
const verify = require("./verify.js");

router.post('/', verify, async (req, res) => {
    try {
        //remove list from lists
        await List.find({_id: req.body.list, owner: req.user.id}).remove().exec();
        //pull list from user
        await User.findByIdAndUpdate(req.user.id, {$pull: {lists: {id: req.body.list}}}, {safe: true});
        res.send("success");
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;
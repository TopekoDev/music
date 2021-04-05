const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const List = require("../models/list.js");
const History = require("../models/history.js");
const verify = require("./verify.js");

router.get('/', verify, async (req, res) => {
    try {
        //remove user
        User.findById(req.user.id).remove().exec();
        //remove user history
        History.deleteOne({user: req.user.id});
        //remove all lists owned by user
        List.deleteMany({owner: req.user.id});
        res.send("success");
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;
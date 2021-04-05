const express = require("express");
const router = express.Router();
const History = require("../models/history.js");
const verify = require("./verify.js");

router.get('/', verify, async (req, res) => {
    //find user history and return
    History
    .find({user: req.user.id})
    .exec(function(err, data) {
        res.send(data);
    });
});

module.exports = router;
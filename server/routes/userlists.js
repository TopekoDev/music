const express = require("express");
const router = express.Router();
const List = require("../models/list.js");
const verify = require("./verify.js");

router.get('/', verify, async (req, res) => {
    //find specific list by user and return data
    List
    .find({owner: req.user.id})
    .exec(function(err, data) {
        res.send(data);
    });
});

module.exports = router;
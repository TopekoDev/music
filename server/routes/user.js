const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const verify = require("./verify.js");

router.get('/', verify, async (req, res) => {
    //find user and return data
    User
    .find({"_id": req.user.id})
    .exec(function(err, data) {
        res.send(data);
    });
});

module.exports = router;
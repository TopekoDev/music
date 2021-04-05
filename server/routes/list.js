const express = require("express");
const router = express.Router();
const List = require("../models/list.js");

router.post('/', async (req, res) => {
    //find specific list by user and return data
    List
    .find({_id: req.body.list})
    .exec(function(err, data) {
        res.send(data);
    });
});

module.exports = router;
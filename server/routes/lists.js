const express = require("express");
const router = express.Router();
const List = require("../models/list.js");

router.post('/', async (req, res) => {
    //return public lists
    List
    .find({public: true})
    .exec(function(err, data) {
        res.send(data);
    });
});

module.exports = router;
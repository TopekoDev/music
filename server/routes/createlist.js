const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const List = require("../models/list.js");
const verify = require("./verify.js");

router.post('/', verify, async (req, res) => {
    try {
        //create list and save to database
        const list = new List({
            name: req.body.name,
            owner: req.user.id,
            public: req.body.public
        });
        list.save(async function(err, nlist) {
            var theId = nlist.id;
            //add list to user
            await User.findByIdAndUpdate(req.user.id, {$push: {lists: {id: theId}}}, {safe: true, upsert: true});
            res.json({"msg": "success", "listId": theId});
        });
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;
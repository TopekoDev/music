const express = require("express");
const router = express.Router();
const Send = require("../models/message.js");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_URL
} = process.env

router.post('/', async (req, res) => {
    var theAuthor = req.body.author;
    var theRecipient = req.body.recipient;
    var theContent = req.body.content;

    //encrypt message
    

    //create message that will be saved to mongodb
    const message = new Send({
        author: theAuthor,
        recipient: theRecipient,
        content: theContent,
    });

    try {
        //save message to database
        await message.save();
        //send details
        res.json({"status":"success"});
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;
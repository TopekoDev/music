const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const verify = require("./verify.js");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_DOMAIN
} = process.env;

router.post('/', verify, async (req, res) => {
    switch(req.body.type) {
        case 'remove':
            try {
                //remove user
                User.findById(req.user.id).remove().exec();
                res.json({"msg":"Removed", "status":"success"});
            } catch(error) {
                res.send(error);
            }
            break;
    }
});

module.exports = router;
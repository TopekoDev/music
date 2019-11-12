const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_URL
} = process.env;

//validation
const Joi = require("joi");
const valSchema = {
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/).min(6).max(50).required()
}

//register user
router.post("/", async (req, res) => {
  //validate data
  const {error} = Joi.validate(req.body, valSchema);
  if(error) return res.json({"msg":error.details[0].message,"status":"fail"});

  const userExist = await User.findOne({username: req.body.username});
  if(userExist) return res.json({"msg":"User already exists","status":"fail"});
  
  //hash and salt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
  //create user
  const user = new User({
    username: req.body.username,
    password: hashedPassword
  });
  try {
    //save user to database
    await user.save();
    //send details
    res.json({"msg":"Registered as " + user.username,"status":"success"});
  } catch(error) {
    res.send(error);
  }
});

router.get("/", (req, res) => {
    res.send({
        message: 'register',
        tip: `post with username and password!`,
    });
});

module.exports = router;

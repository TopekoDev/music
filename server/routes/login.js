const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_URL
} = process.env;

//validation
const Joi = require('joi');
const valSchema = {
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/).min(6).max(50).required()
}

//login user
router.post("/", async (req, res) => {
  //validate data
  const {error} = Joi.validate(req.body, valSchema);
  if(error) return res.json({"msg":"Invalid password or user","status":"fail"});

  const user = await User.findOne({username: req.body.username});
  if(!user) return res.json({"msg":"User not found","status":"fail"});

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.json({"msg":"Incorrect password","status":"fail"});

  //create token
  const token = jwt.sign({
    id: user._id, username: user.username, email: user.email
  }, TOKEN_SECRET);

  //send token back in a cookie
  res.cookie('token', token, {maxAge: 1000*60*60*24*365*2, httpOnly: true, domain: CLIENT_URL});
  res.cookie('loggedin', 'true', {maxAge: 1000*60*60*24*365*2, httpOnly: false, domain: CLIENT_URL});
  //send details
  res.json({"msg":"Logged in as " + user.username,"status":"success"});
});

module.exports = router;

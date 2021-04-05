const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const History = require("../models/history.js");
const bcrypt = require("bcryptjs");

//validation schema
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
  //save user to database
  user.save(async function(err, nuser) {
    if(err) {
      return res.json({"msg":"Failed", "status":"fail"});
    }
    //create history for user
    const history = new History({
      user: nuser.id,
    });
    history.save(function(err) {
      if(err) {
        return res.json({"msg":"Failed", "status":"fail"});
      }
      //send details
      res.json({"msg":"Registered as " + user.username,"status":"success"});
    });
  });
});

module.exports = router;

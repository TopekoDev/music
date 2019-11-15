const express = require("express");
const router = express.Router();

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_URL
} = process.env;

//logout user
router.get("/", (req, res) => {
  //clear token cookie from the user
  res.cookie('token', "", { expires: new Date(), domain: CLIENT_URL });
  res.cookie('loggedin', "", { expires: new Date(), domain: CLIENT_URL });
  res.cookie('api_key', "", { expires: new Date(), domain: CLIENT_URL });
  res.cookie('public_key', "", { expires: new Date(), domain: CLIENT_URL });
  res.cookie('log_history', "", { expires: new Date(), domain: CLIENT_URL });
  //return details
  return res.json({"msg":"Logged out"});
});

module.exports = router;

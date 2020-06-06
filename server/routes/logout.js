const express = require("express");
const router = express.Router();

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_DOMAIN
} = process.env;

//logout user
router.get("/", (req, res) => {
  //clear token cookie from the user
  res.cookie('token', "", { expires: new Date(), domain: CLIENT_DOMAIN });
  res.cookie('loggedin', "", { expires: new Date(), domain: CLIENT_DOMAIN });
  res.cookie('api_key', "", { expires: new Date(), domain: CLIENT_DOMAIN });
  res.cookie('public_key', "", { expires: new Date(), domain: CLIENT_DOMAIN });
  res.cookie('volume', "", { expires: new Date(), domain: CLIENT_DOMAIN });
  //return details
  return res.json({"msg":"Logged out"});
});

module.exports = router;

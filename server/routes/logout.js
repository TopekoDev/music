const express = require("express");
const router = express.Router();

//logout user
router.get("/", (req, res) => {
  //clear cookies
  res.cookie('token', "", { expires: new Date(), domain: process.env.CLIENT_DOMAIN });
  res.cookie('loggedin', "", { expires: new Date(), domain: process.env.CLIENT_DOMAIN });
  res.cookie('api_key', "", { expires: new Date(), domain: process.env.CLIENT_DOMAIN });
  res.cookie('public_key', "", { expires: new Date(), domain: process.env.CLIENT_DOMAIN });
  res.cookie('volume', "", { expires: new Date(), domain: process.env.CLIENT_DOMAIN });
  return res.send("success");
});

module.exports = router;

const jwt = require('jsonwebtoken');

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_DOMAIN
} = process.env;

module.exports = function (req, res, next) {
    const token = req.cookies.token;
    if(!token) return res.json({"msg":"Not logged in"});

    try {
        const verified = jwt.verify(token, TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(error) {
        res.json({"msg":"Invalid token"});
    }
}
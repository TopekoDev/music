const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //check if user is logged in
    const token = req.cookies.token;
    if(!token) return res.json({"msg":"Not logged in"});
    //check if user token is valid
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(error) {
        res.json({"msg":"Invalid token"});
    }
}
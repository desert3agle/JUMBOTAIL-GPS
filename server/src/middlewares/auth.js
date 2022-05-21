const jwt = require("jsonwebtoken");


const tokenVerify = async (req, res, next)  => {
    const token = req.cookies.jwt;
    
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

  
module.exports = { tokenVerify };
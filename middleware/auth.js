//auth middleware
//include this in any route to make it private.
//Any route without this middleware will be publicly available

const jwt       = require("jsonwebtoken");
const userModel = require('../model/others/User');

module.exports = async function (req, res, next) {
    //get token from header
    const token = req.header("Authorization").replace("Bearer ", "");
    
    //check if no token

    if (!token) { 
        return res.status(401).json({ error: "No token, auth denied" });
    } 

    //verify token
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user      = decoded._id;
        const user    = await userModel.findById(req.user);
        if (!user) {
            return res
                .status(400)
                .json({ error: "Invalid User or user not found" });
        }
        next(); 
    } catch (error) {
        res.status(401).json({ error: "Token invalid" });
    }
};

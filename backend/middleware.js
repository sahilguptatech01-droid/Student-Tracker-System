const dotenv = require("dotenv");

dotenv.config();

const SECRET_KEY=process.env.SECRET_KEY ;

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        });
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        req.id = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports = { authMiddleware };
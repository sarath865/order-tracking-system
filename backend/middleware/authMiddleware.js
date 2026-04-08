const jwt = require("jsonwebtoken");

const SECRET = "secret";

module.exports = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    // Handle "Bearer TOKEN"
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};


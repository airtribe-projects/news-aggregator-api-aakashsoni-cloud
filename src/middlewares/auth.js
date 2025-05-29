const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    req.user = decodedToken;
    next();
};

module.exports = {
    verifyToken
};

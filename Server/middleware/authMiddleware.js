const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logging');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            logger.warn('Authentication failed: No token provided');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            logger.warn(`Authentication failed: User not found for token ${token}`);
            throw new Error('User not found');
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = authMiddleware;

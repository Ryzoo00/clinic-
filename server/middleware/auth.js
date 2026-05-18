import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, return unauthorized
    if (!token) {
      return res.status(401).json({ 
        error: 'Not authorized to access this route' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          error: 'User not found' 
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({ 
          error: 'User account is deactivated' 
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error during authentication' 
    });
  }
};

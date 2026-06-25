// @desc    Check if user has the correct role
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      // req.user is set by your protect middleware
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Role: ${req.user.role} is not authorized to access this resource`,
        });
      }
      next();
    };
  };
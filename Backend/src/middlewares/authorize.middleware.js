import { ApiError } from "../utils/ApiError";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized access");
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, `Role ${userRole} cannot access`);
    }

    next();
  };
};
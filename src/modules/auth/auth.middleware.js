import APIError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
  let accessToken;
  if (req.headers.authorization?.startsWith("Bearer")) {
    // is token is in coockie then access from cookie (using cokkie parser) otherwise access from headers // npm i cookie-parser
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) throw APIError.unauthorized("Not autheticated");

  const decoded = verifyAccessToken(accessToken); // access decoaded value
  if (!decoded) {
    throw APIError.unauthorized("Not autheticated");
  }

  const user = await User.findById(decoded.id);

  if (!user) throw APIError.unauthorized("User not found");

  req.user = {
    id: user._id,
    role: user.role,
    email: user.email,
    name: user.name,
  };

  next();
};

const authorize = (...roles) => {
  // roels array to verify to access user role
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw APIError.forbidden(
        "You do not have permission to perform this action",
      );
    }
    next();
  };
};

export { authenticate, authorize };

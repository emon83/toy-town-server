import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import config from "../config/config.js";
import AppError from "../errors/AppError.js";
import { User } from "../modules/user/user.model.js";

const auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    //* checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    //* checking if the given token is valid
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret);
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
    }

    const { role, email, iat } = decoded;

    //* checking if the user is exist
    const user = await User.isUserExistsByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    //* checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
    }

    //* checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked !!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }
    req.user = decoded;

    next();
  });
};

export default auth;

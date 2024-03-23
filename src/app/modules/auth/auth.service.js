import httpStatus from "http-status";
import { User } from "../user/user.model.js";
import { createToken, verifyToken } from "./auth.utils.js";
import config from "../../config/config.js";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError.js";

const loginUser = async (payload) => {
  //* checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);
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

  //* checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //* create token and sent to the client
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return {
    //   user: userData,
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (userData, payload) => {
  //* checking if the user ----> 1.is exist, 2. already deleted, 3. is blocked from auth gard validation
  const user = await User.isUserExistsByEmail(userData.email);

  //* checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //* hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

const refreshToken = async (token) => {
  //* checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret);

  const { email, iat } = decoded;

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
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked !");
  }

  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return {
    accessToken,
  };
};



export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};

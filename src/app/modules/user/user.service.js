import httpStatus from "http-status";
import config from "../../config/config.js";
import { createToken } from "../auth/auth.utils.js";
import { User } from "./user.model.js";
import AppError from "../../errors/AppError.js";

const registerUserIntoDB = async (payload) => {
  //* checking if the user is exist
  const isExistUser = await User.isUserExistsByEmail(payload.email);
  if (isExistUser) {
    throw new AppError(httpStatus.CONFLICT, "This user is already exist!");
  }

  const result = await User.create(payload);

  //* create token and sent to the  client
  const jwtPayload = {
    _id: result._id,
    email: result.email,
    role: result.role,
  };

  const data = {
    ...jwtPayload,
    username: result.username,
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
    result,
    accessToken,
    refreshToken,
    needsPasswordChange: data?.needsPasswordChange,
  };
};

export const UserServices = {
  registerUserIntoDB,
};

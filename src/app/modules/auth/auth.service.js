import httpStatus from "http-status";
import { User } from "../user/user.model.js";
import { createToken } from "./auth.utils.js";
import config from "../../config/config.js";

const loginUser = async (payload) => {
  //* checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  //* checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

   //* checking if the user is blocked
   const userStatus = user?.status;
   if (userStatus === 'blocked') {
     throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !!');
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

  const userData = {
    ...jwtPayload,
    username: user.username,
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

export const AuthServices = {
  loginUser,
};

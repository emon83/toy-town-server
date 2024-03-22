import config from "../../config/config.js";
import { createToken } from "../auth/auth.utils.js";
import { User } from "./user.model.js";

const registerUserIntoDB = async (payload) => {
    const result = await User.create(payload);
  
    //* create token and sent to the  client
    const jwtPayload = {
      _id: result._id,
      email: result.email,
      role: result.role,
    };
  
    const userData = {
      ...jwtPayload,
      username: result.username,
    };
  
    const token = createToken(
      jwtPayload,
      config.jwt_token_secret,
      config.jwt_access_expires_in,
    );
  
    return {
      user: userData,
      token,
    };
  };

  export const UserServices = {
    registerUserIntoDB,
  };
  
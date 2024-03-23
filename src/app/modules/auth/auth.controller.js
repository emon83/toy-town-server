import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AuthServices } from "./auth.service.js";
import config from "../../config/config.js";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken, needsPasswordChange } = result;

    res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User login successful",
      data: {
        accessToken,
        needsPasswordChange
      },
    });
  });
  
  export const AuthControllers = {
    loginUser,
  };
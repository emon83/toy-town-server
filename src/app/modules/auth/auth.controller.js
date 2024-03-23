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

  const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body;
    const result = await AuthServices.changePassword(req.user, passwordData);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password is updated successfully!',
      data: result,
    });
  });

  const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token is retrieved successfully!',
      data: result,
    });
  });

  const forgetPassword = catchAsync(async (req, res) => {
    const result = await AuthServices.forgetPassword(req.body);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reset link is generated successfully! Check your email!',
      data: result,
    });
  });

  const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization;
  
    const result = await AuthServices.resetPassword(req.body, token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset successful!',
      data: result,
    });
  });
  
  export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
  };
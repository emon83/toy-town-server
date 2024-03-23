import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UserServices } from "./user.service.js";
import config from "../../config/config.js";

const registerUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const user = await UserServices.registerUserIntoDB(userData);

  const { refreshToken, result } = user;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const UserControllers = {
  registerUser,
};

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UserServices } from "./user.service.js";

const registerUser = catchAsync(async (req, res) => {
    const userData = req.body;
    const result = await UserServices.registerUserIntoDB(userData);
  
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
  
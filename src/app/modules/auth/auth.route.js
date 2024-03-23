import express from "express";
import { AuthControllers } from "./auth.controller.js";
import zodValidationRequest from "../../middleware/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { USER_ROLE } from "../user/user.constant.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  '/login',
  zodValidationRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.user,
  ),
  zodValidationRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  // zodValidationRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/forgot-password',
  zodValidationRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
);

router.post(
  '/reset-password',
  zodValidationRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword
)

export const AuthRoutes = router;

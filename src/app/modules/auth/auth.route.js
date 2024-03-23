import express from "express";
import { AuthControllers } from "./auth.controller.js";
import zodValidationRequest from "../../middleware/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";

const router = express.Router();

router.post(
  '/login',
  zodValidationRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

  export const AuthRoutes = router;

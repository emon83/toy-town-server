import express from "express";
import { UserControllers } from "./user.controller.js";
import zodValidationRequest from "../../middleware/validateRequest.js";
import { UserValidation } from "./user.validation.js";

const router = express.Router();
router.post(
  "/register",
  zodValidationRequest(UserValidation.userRegistrationValidationSchema),
  UserControllers.registerUser
);

export const UserRoutes = router;

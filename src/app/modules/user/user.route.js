import express from "express";
import { UserControllers } from "./user.controller.js";

const router = express.Router();
router.post(
    '/register',
    UserControllers.registerUser,
  );

  export const UserRoutes = router;

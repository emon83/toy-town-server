import { z } from "zod";
import { UserRoleStatus } from "./user.constant";

const userValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string(),
    role: z.enum([...UserRoleStatus]).optional(),
    password: z
      .string({
        invalid_type_error: "Password must be string",
      })
      .max(20, { message: "Password can not be more 20 characters" })
      .optional(),
    photoURL: z.string(),
  }),
});

export const UserValidation = {
  userValidationSchema,
};

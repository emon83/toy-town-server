import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
      email: z.string(),
      password: z
        .string({
          invalid_type_error: "Password must be a string",
        })
        .max(12, { message: "Password cannot be more than 12 characters" }),
    }),
  });

  export const AuthValidation = {
    loginValidationSchema
  }
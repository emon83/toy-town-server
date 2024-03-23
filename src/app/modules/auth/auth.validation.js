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

  const changePasswordValidationSchema = z.object({
    body: z.object({
      oldPassword: z.string({
        required_error: 'Old password is required',
      }),
      newPassword: z.string({ required_error: 'Password is required' }),
    }),
  });

  const refreshTokenValidationSchema = z.object({
    cookies: z.object({
      refreshToken: z.string({
        required_error: 'Refresh token is required!',
      }),
    }),
  });

  export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
  }
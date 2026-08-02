import {z} from 'zod'


export const RegisterSchema = z.object({
  firstName: z
    .string()
    .min(3, "name is required!"),

  lastName: z
    .string()
    .min(3, "name is required!"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters!")
    .max(20, "Username must be at most 20 characters!")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores!"
    ),

  email: z
    .string()
    .email("your email not correct!")
    .min(1, "email is required!"),

  password: z
    .string()
    .min(1, "password is required!"),

  confirmPassword: z
    .string()
    .min(1, "password is required!"),

  birth: z
    .string()
    .date(),

  gender: z.enum(["male", "female"], {
    message: "select your gender!",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match!",
  path: ["confirmPassword"],
});

export type RegisterData = z.infer< typeof RegisterSchema >
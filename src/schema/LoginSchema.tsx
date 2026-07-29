import {z} from 'zod'

export const LoginSchema = z.object({
    email : z
        .string()
        .email('your email not correct!')
        .min(1 , "email is required !"),
    password : z
        .string()
        .min(1,'password is required !'),
}) ;

export type LoginData = z.infer< typeof LoginSchema >
import {z} from 'zod'


export const RegisterSchema = z.object({
    name : z
        .string()
        .min(3 , "name is required!") ,
    email : z
        .string()
        .email('your email not correct!')
        .min(1 , "email is required !"),
    password : z
        .string()
        .min(1,'password is required !'),
    confirmPassword : z
        .string()
        .min(1,'password is required !'),
    birth : z
        .string()
        .date() ,
    gender : z 
        .enum(['male' ,'female'] ,{
            message: 'select your gender!',
        })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
});

export type RegisterData = z.infer< typeof RegisterSchema >
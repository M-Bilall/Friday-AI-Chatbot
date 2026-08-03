import { z } from 'zod';

export const authEmailSchema = z.object({
  email: z.string().email('Enter a valid email address')
});

export const signInSchema = authEmailSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(2, 'Enter your name')
});

export const forgotPasswordSchema = authEmailSchema;

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
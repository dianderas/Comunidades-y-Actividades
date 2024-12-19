import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .email('Correo invalido')
      .min(1, 'El correo es obligatorio'),
    nickname: z
      .string()
      .min(1, 'El correo es obligatorio'),
    password: z
      .string()
      .min(6, 'La contraseña debe de tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'La confirmacion debe tener al menos 6 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas son diferentes',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
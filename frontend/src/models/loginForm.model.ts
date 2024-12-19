import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .email('Correo invalido')
      .min(1, 'El correo es obligatorio'),
    password: z
      .string()
      .min(6, 'La contraseña debe de tener al menos 6 caracteres'),
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
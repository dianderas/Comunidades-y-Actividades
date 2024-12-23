import { z } from "zod";

export const loginSchema = z
  .object({
    startDate: z.string().date(),
    endDate: z.string().date(),
    name: z.string().min(4, 'El nombre debe de tener al menos 4 caracteres'),
  });

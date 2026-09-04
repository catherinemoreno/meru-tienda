import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "Ingresa tu nombre completo"),
  phone: z
    .string()
    .trim()
    .min(7, "Ingresa un celular válido")
    .regex(/^[0-9+ ]+$/, "Solo números"),
  email: z.string().trim().email("Ingresa un correo válido"),
  department: z.string().min(1, "Selecciona un departamento"),
  city: z.string().trim().min(2, "Ingresa tu ciudad"),
  address: z.string().trim().min(5, "Ingresa tu dirección"),
  neighborhood: z.string().trim().min(2, "Ingresa tu barrio"),
  reference: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  confirm: z.literal(true, { message: "Debes confirmar el pedido" }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

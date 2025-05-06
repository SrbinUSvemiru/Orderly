import * as z from "zod";

export const AccountSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    firstName: z.string().min(2, "First name"),
    lastName: z.string().min(2, "Last name"),
    organisationId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const CompanySchema = z.object({
  companyName: z.string().min(2, "Must have at least two letters"),
  address: z.object({
    country: z.string().min(1, "Country is required"),
    city: z
      .string()
      .min(2, "City must have at least two letters")
      .regex(/^[A-Za-z]+$/, "Only letters allowed"),
    street: z.string().min(2, "Street must have at least two letters"),
    streetNumber: z
      .string()
      .min(1, "Street number is required")
      .regex(/^\d+$/, "Only digits allowed"),
    postalCode: z
      .string()
      .min(5, "Postal code must have at least 5 digits")
      .regex(/^\d+$/, "Only digits allowed"),
  }),
});

export const RegisterSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    firstName: z.string().min(2, "First name"),
    lastName: z.string().min(2, "Last name"),
    companyName: z
      .string()
      .min(2, "Company name must have at least two letters"),
    address: z.object({
      country: z.string().min(1, "Country is required"),
      city: z
        .string()
        .min(2, "City must have at least two letters")
        .regex(/^[A-Za-z]+$/, "Only letters allowed"),
      street: z.string().min(2, "Street must have at least two letters"),
      streetNumber: z
        .string()
        .min(1, "Street number is required")
        .regex(/^\d+$/, "Only digits allowed"),
      postalCode: z
        .string()
        .min(5, "Postal code must have at least 5 digits")
        .regex(/^\d+$/, "Only digits allowed"),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

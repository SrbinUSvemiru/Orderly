import * as z from "zod";

export const AccountSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  // password: z
  //   .string()
  //   .min(1, "Password is required")
  //   .min(8, "Password must have more than 8 characters")
  //   .optional()
  //   .or(z.literal("")),
  // confirmPassword: z
  //   .string()
  //   .min(1, "Password confirmation is required")
  //   .optional()
  //   .or(z.literal("")),
  phone: z.string().min(5, "Phone must have at least 5 digits"),
  firstName: z.string().min(2, "First name must have at least two letters"),
  lastName: z.string(),
});
// .refine((data) => data.password === data.confirmPassword, {
//   path: ["confirmPassword"],
//   message: "Passwords do not match",
// });

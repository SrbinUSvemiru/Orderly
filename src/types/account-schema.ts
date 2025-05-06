import * as z from "zod";

export const AccountSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().min(5, "Phone must have at least 5 digits"),
  firstName: z.string().min(2, "First name must have at least two letters"),
  lastName: z.string(),
});

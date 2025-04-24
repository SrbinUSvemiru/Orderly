import * as z from "zod";

export const InviteClient = z.object({
  email: z.string().email("Invalid email"),
});

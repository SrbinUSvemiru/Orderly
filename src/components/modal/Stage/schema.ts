import * as z from "zod";

export const StageSchema = z.object({
  name: z.string().min(3, "Stage must be at least 3 characters"),
});

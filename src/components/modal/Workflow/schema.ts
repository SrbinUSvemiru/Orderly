import * as z from "zod";

export const WorkflowSchema = z.object({
  name: z.string().min(3, "Workflow must be at least 3 characters"),
});

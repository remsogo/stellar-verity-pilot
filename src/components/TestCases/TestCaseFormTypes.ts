
import { z } from "zod";

export const testCaseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  preconditions: z.string().optional(),
  steps: z.string().min(5, { message: "Steps must be at least 5 characters." }),
  expected_result: z.string().min(5, { message: "Expected result must be at least 5 characters." }),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  status: z.enum(["Draft", "Ready", "Blocked"]).default("Draft"),
  parent_id: z.string().nullable().optional(),
  is_parent: z.boolean().default(false),
});

export type TestCaseFormValues = z.infer<typeof testCaseSchema>;


import { z } from "zod";
import { Priority, Status } from "@/types";

export const testCaseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  preconditions: z.string().optional(),
  steps: z.string().min(5, { message: "Steps must be at least 5 characters." }),
  expected_result: z.string().min(5, { message: "Expected result must be at least 5 characters." }),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  status: z.enum(["Draft", "Ready", "Blocked"]).default("Draft"),
  tags: z.array(z.string()).default([]),
});

export type TestCaseFormValues = z.infer<typeof testCaseSchema>;

// Conversion functions for form values to API types
export const convertFormPriorityToApiPriority = (formPriority: string): Priority => {
  switch (formPriority.toLowerCase()) {
    case "high": return "high";
    case "medium": return "medium";
    case "low": return "low";
    default: return "medium";
  }
};

export const convertFormStatusToApiStatus = (formStatus: string): Status => {
  switch (formStatus.toLowerCase()) {
    case "draft": return "draft";
    case "ready": return "ready";
    case "blocked": return "blocked";
    default: return "draft";
  }
};

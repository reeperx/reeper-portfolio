import { z } from "zod";

export const projectTypes = [
  "Launch site",
  "Web app",
  "Rescue",
  "Something else",
] as const;

export const budgets = [
  "Under R25k",
  "R25k – R50k",
  "R50k – R100k",
  "R100k+",
  "Not sure yet",
] as const;

export const timelines = [
  "ASAP",
  "2–4 weeks",
  "1–2 months",
  "Flexible",
] as const;

export const HONEYPOT_FIELD = "bot-field";

const contactFields = [
  "name",
  "email",
  "company",
  "projectType",
  "budget",
  "timeline",
  "message",
] as const;

export type ContactField = (typeof contactFields)[number];

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

const contactFieldSet = new Set<string>(contactFields);

export const contactInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tell me your name.")
    .max(80, "Keep your name under 80 characters."),
  email: z
    .email("Enter a valid email address.")
    .max(254, "Keep your email under 254 characters."),
  company: z
    .string()
    .trim()
    .max(120, "Keep the company name under 120 characters.")
    .optional()
    .transform((value) => value || undefined),
  projectType: z.enum(projectTypes, {
    message: "Choose a project type.",
  }),
  budget: z.enum(budgets, {
    message: "Choose a budget range.",
  }),
  timeline: z.enum(timelines, {
    message: "Choose a timeline.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Give me at least a couple of sentences.")
    .max(5000, "Keep the brief under 5,000 characters."),
});

export type ContactInquiry = z.infer<typeof contactInquirySchema>;

export function getContactFieldErrors(error: z.ZodError): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      contactFieldSet.has(field) &&
      !fieldErrors[field as ContactField]
    ) {
      fieldErrors[field as ContactField] = issue.message;
    }
  }

  return fieldErrors;
}

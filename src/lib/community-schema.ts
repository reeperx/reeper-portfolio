import { z } from "zod";

export const HONEYPOT_FIELD = "bot-field";

const optionalWebsite = z
  .string()
  .trim()
  .max(240, "Keep the website address under 240 characters.")
  .optional()
  .default("")
  .refine(
    (value) => value === "" || /^https?:\/\/[^\s]+$/i.test(value),
    "Use a full http:// or https:// address, or leave it empty.",
  );

export const commentSubmissionSchema = z.object({
  postSlug: z
    .string()
    .trim()
    .min(1, "Choose a post.")
    .max(160, "That post address is too long."),
  parentId: z
    .union([z.uuid(), z.literal(""), z.null(), z.undefined()])
    .optional()
    .transform((value) => (value ? value : undefined)),
  name: z
    .string()
    .trim()
    .min(2, "Tell us your name.")
    .max(80, "Keep your name under 80 characters."),
  email: z
    .email("Enter a valid email address.")
    .max(254, "Keep your email under 254 characters."),
  website: optionalWebsite,
  body: z
    .string()
    .trim()
    .min(5, "Write a little more than that.")
    .max(3000, "Keep the comment under 3,000 characters."),
  consent: z
    .boolean()
    .refine((value) => value, "Please agree to the comment policy."),
});

export type CommentSubmission = z.infer<typeof commentSubmissionSchema>;

export const reviewSubmissionSchema = z.object({
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
    .default(""),
  role: z
    .string()
    .trim()
    .max(120, "Keep your role under 120 characters.")
    .optional()
    .default(""),
  quote: z
    .string()
    .trim()
    .min(20, "Give me at least a couple of sentences.")
    .max(3000, "Keep the review under 3,000 characters."),
  rating: z
    .union([
      z.number().int().min(1).max(5),
      z.null(),
      z.undefined(),
    ])
    .optional()
    .transform((value) => (value ?? null)),
  consent: z
    .boolean()
    .refine((value) => value, "Please consent to publication."),
  clientConfirmation: z
    .boolean()
    .refine((value) => value, "Please confirm you have worked with TOGB."),
});

export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Enter the admin password."),
});

export const adminPostSchema = z.object({
  id: z
    .union([z.uuid(), z.literal("")])
    .optional()
    .default(""),
  title: z
    .string()
    .trim()
    .min(3, "Give the post a title.")
    .max(140, "Keep the title under 140 characters."),
  slug: z
    .string()
    .trim()
    .max(160, "Keep the slug under 160 characters.")
    .optional()
    .default(""),
  excerpt: z
    .string()
    .trim()
    .min(20, "Write a short excerpt.")
    .max(320, "Keep the excerpt under 320 characters."),
  content: z
    .string()
    .trim()
    .min(50, "Write at least a few paragraphs.")
    .max(120_000, "Keep the post under 120,000 characters."),
  coverImageUrl: z
    .string()
    .trim()
    .max(500, "Keep the image address under 500 characters.")
    .optional()
    .default("")
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("/") ||
        /^https?:\/\/[^\s]+$/i.test(value),
      "Use a site path or a full http:// or https:// address.",
    ),
  coverImageAlt: z
    .string()
    .trim()
    .max(180, "Keep the image description under 180 characters.")
    .optional()
    .default(""),
  tags: z
    .string()
    .trim()
    .max(400, "Keep the tag list under 400 characters.")
    .optional()
    .default(""),
  status: z.enum(["draft", "published"]),
  publishedAt: z
    .string()
    .trim()
    .max(40, "That date is too long.")
    .optional()
    .default(""),
});

export type AdminPostInput = z.infer<typeof adminPostSchema>;

export function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ).slice(0, 8);
}

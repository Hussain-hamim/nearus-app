import { z } from "zod";

export const emailSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(120, "Title must be 120 characters or less."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(2000, "Description must be 2000 characters or less."),
  category: z.enum([
    "services",
    "rentals",
    "study",
    "fashion",
    "food",
    "tech",
    "errands",
    "other",
  ]),
  area: z.string().trim().min(2, "Enter an area."),
  locality: z.string().trim().min(2, "Enter a locality or district."),
  city: z.string().trim().min(2, "Enter a city."),
  formatted_address: z.string().trim().min(2).optional(),
  budget_amount: z
    .number({ error: "Enter a cash amount." })
    .positive("Enter a cash amount.")
    .max(1_000_000, "Amount is too large."),
  scheduled_at: z.string().datetime().nullable().optional(),
  visibility_radius_km: z.union([z.literal(2), z.literal(5), z.literal(10)]),
  lat: z.number(),
  lng: z.number(),
});

export const offerSchema = z.object({
  task_id: z.uuid(),
  message: z
    .string()
    .trim()
    .min(4, "Write a short message.")
    .max(1000, "Message is too long."),
});

export const reviewSchema = z.object({
  task_id: z.uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export const reportSchema = z.object({
  reported_user_id: z.uuid(),
  task_id: z.uuid().optional(),
  reason: z.enum(["spam", "harassment", "scam", "inappropriate", "other"]),
  details: z.string().trim().max(2000).optional(),
});

export const profileSchema = z.object({
  display_name: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(500).optional(),
  area: z.string().trim().max(80).optional(),
  locality: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
});

export const messageSchema = z.object({
  conversation_id: z.uuid(),
  body: z.string().trim().min(1).max(4000),
});

export type TaskInput = z.infer<typeof taskSchema>;

import { z } from "zod";

export const PostCreateSchema = z.object({
  content: z.string().min(1).max(500),
  imageUrl: z.string().url().optional().or(z.literal("")).transform(v => v || undefined),
});

export const CommentCreateSchema = z.object({
  content: z.string().min(1).max(300),
});

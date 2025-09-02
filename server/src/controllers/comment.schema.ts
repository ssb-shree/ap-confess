import z from "zod";

const commentSchema = z.object({
  message: z.string().min(2),
});

export { commentSchema };

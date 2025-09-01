import z from "zod";

const writeSchema = z.object({
  title: z.string().min(3).max(250),
  body: z.string().min(25),
  categories: z.array(z.string().min(2).max(20)).min(3).max(20),
});

const mongoID = z.object({ ID: z.string().min(1).max(25) });

export { writeSchema, mongoID };

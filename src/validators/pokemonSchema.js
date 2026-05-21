const { z } = require("zod");

const pokemonSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name too long")
    .regex(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces and hyphens"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  hp: z.coerce.number().min(0).max(255).default(0),
  strength: z.coerce.number().min(0).max(255).default(0),
  defense: z.coerce.number().min(0).max(255).default(0),
  speed: z.coerce.number().min(0).max(255).default(0),
  height: z.coerce.number().min(0).default(0),
  weight: z.coerce.number().min(0).default(0),
  typesId: z.array(z.number().int().positive()).max(2).default([]),
});

module.exports = { pokemonSchema };

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const catalog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "src/content/catalog" }),
  schema: z.object({
    title: z.string(),
    listingType: z.string().optional(), // 👈 Add this line
    auctionEndDate: z.string().optional().nullable(), // 👈 Add this line too
    price: z.number().optional(),
    currentBid: z.number().optional(),
    category: z.string().optional(),
    condition: z.string().optional(),
    image: z.string().optional(),
    image2: z.string().optional(),
    image3: z.string().optional(),
    description: z.string().optional(),
    sellerTag: z.string().default("Miembro Verificado"),
  }),
});

export const collections = { catalog };
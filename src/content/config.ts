import { defineCollection, z } from 'astro:content';

const catalogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    price: z.number().optional(),
    currentBid: z.number().optional(),
    category: z.enum(["Electrónica", "Muebles", "Vehículos", "Ropa", "Hogar", "Otros"]).optional(),
    condition: z.enum(["Como Nuevo", "Excelente", "Bueno", "Usado"]).optional(),
    image: z.string().optional(),
    image2: z.string().optional(),
    image3: z.string().optional(),
    description: z.string().optional(),
    sellerTag: z.string().default("Miembro Verificado"),
  }),
});

export const collections = {
  catalog: catalogCollection,
};
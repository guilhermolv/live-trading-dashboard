import { z } from 'zod';

export const assetSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number().positive(),
  previousClose: z.number().positive(),
});

export const tradeSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  side: z.enum(['buy', 'sell']),
  quantity: z.number().positive(),
  price: z.number().positive(),
  createdAt: z.string(),
});

export const tickSchema = z.object({
  type: z.literal('market-tick'),
  asset: assetSchema,
  trade: tradeSchema,
  createdAt: z.string(),
});

export type Asset = z.infer<typeof assetSchema>;
export type Trade = z.infer<typeof tradeSchema>;
export type Tick = z.infer<typeof tickSchema>;

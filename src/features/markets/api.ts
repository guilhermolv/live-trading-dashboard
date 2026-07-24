import { assetSchema, type Asset } from '../../shared/schemas';

export async function fetchAssets(): Promise<Asset[]> {
  const response = await fetch('/api/assets');
  const body: unknown = await response.json();
  if (!response.ok) throw new Error('Unable to load assets');
  return assetSchema.array().parse(body);
}

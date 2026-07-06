import { MetadataRoute } from 'next';
import { dbService } from '@/services/dbService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Static Pages
  const staticPages = [
    '',
    '/catalogo',
    '/sobre',
    '/projetos',
    '/contato',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Product Pages
  try {
    const products = await dbService.getProducts({ onlyActive: true });
    const productPages = products.map((prod) => {
      const catSlug = prod.categoria?.slug || 'produtos';
      return {
        url: `${baseUrl}/${catSlug}/${prod.slug}`,
        lastModified: new Date(prod.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticPages;
  }
}

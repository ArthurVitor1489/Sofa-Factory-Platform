import { dbService } from '@/services/dbService';
import ProductsManager from '@/components/dashboard/ProductsManager';

export const dynamic = 'force-dynamic'; // Prevent static cache since this displays dynamic admin records

export default async function AdminProductsPage() {
  const products = await dbService.getProducts();
  const categories = await dbService.getCategories();

  return (
    <ProductsManager
      initialProducts={products}
      categories={categories}
    />
  );
}

import ProductList from "@/components/store/shared/product-list";
import { getProducts } from "@/queries/product";

export default async function HomePage() {
  const productsData = await getProducts();
  const { products } = productsData;
  return (
    <div className="p-14">
      <ProductList products={products} title="Products" arrow />
    </div>
  );
}

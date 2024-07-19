// Queries
import DataTable from "@/components/ui/data-table";
import { getAllStoreProducts } from "@/queries/product";
import { columns } from "./columns";

export default async function SellerProductsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  // Fetching products data from the database for the active store
  const products = await getAllStoreProducts(params.storeUrl);

  return (
    <DataTable
      filterValue="name"
      data={products}
      columns={columns}
      searchPlaceholder="Search product name..."
    />
  );
}

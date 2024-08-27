// Queries
import { getAllOfferTags } from "@/queries/offer-tag";

// Data table
import DataTable from "@/components/ui/data-table";

// Plus icon
import { Plus } from "lucide-react";

// Offer tag details
import OfferTagDetails from "@/components/dashboard/forms/offer-tag-details";

// Columns
import { columns } from "./columns";

export default async function AdminOfferTagsPage() {
  // Fetching offer tags data from the database
  const categories = await getAllOfferTags();

  // Checking if no offer tags are found
  if (!categories) return null; // If no offer tags found, return null

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create offer tag
        </>
      }
      modalChildren={<OfferTagDetails />}
      filterValue="name"
      data={categories}
      searchPlaceholder="Search offer tag name..."
      columns={columns}
    />
  );
}

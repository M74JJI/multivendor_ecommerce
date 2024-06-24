import { getAllSubCategories } from "@/queries/subCategory";
import { Prisma } from "@prisma/client";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

// SubCategory + parent category
export type SubCategoryWithCategoryType = Prisma.PromiseReturnType<
  typeof getAllSubCategories
>[0];

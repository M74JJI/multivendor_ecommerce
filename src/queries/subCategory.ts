"use server";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// DB
import { db } from "@/lib/db";

// Prisma model
import { Category, SubCategory } from "@prisma/client";

// Function: upsertSubCategory
// Description: Upserts a subCategory into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - SubCategory: subCategory object containing details of the subCategory to be upserted.
// Returns: Updated or newly created subCategory details.
export const upsertSubCategory = async (subCategory: SubCategory) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify admin permission
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error(
        "Unauthorized Access: Admin Privileges Required for Entry."
      );

    // Ensure SubCategory data is provided
    if (!subCategory) throw new Error("Please provide subCategory data.");

    // Throw error if category with same name or URL already exists
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          {
            NOT: {
              id: subCategory.id,
            },
          },
        ],
      },
    });

    // Throw error if category with same name or URL already exists
    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name) {
        errorMessage = "A SubCategory with the same name already exists";
      } else if (existingSubCategory.url === subCategory.url) {
        errorMessage = "A SubCategory with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert SubCategory into the database
    const subCategoryDetails = await db.subCategory.upsert({
      where: {
        id: subCategory.id,
      },
      update: subCategory,
      create: subCategory,
    });
    return subCategoryDetails;
  } catch (error) {
    // Log and re-throw any errors
    console.log(error);
    throw error;
  }
};

// Function: getAllSubCategories
// Description: Retrieves all subCategories from the database.
// Permission Level: Public
// Returns: Array of categories sorted by updatedAt date in descending order.
export const getAllSubCategories = async () => {
  // Retrieve all subCategories from the database
  const subCategories = await db.subCategory.findMany({
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

// Function: getSubCategory
// Description: Retrieves a specific SubCategory from the database.
// Access Level: Public
// Parameters:
//   - SubCategoryId: The ID of the SubCategory to be retrieved.
// Returns: Details of the requested SubCategory.
export const getSubCategory = async (subCategoryId: string) => {
  // Ensure subCategory ID is provided
  if (!subCategoryId) throw new Error("Please provide suCategory ID.");

  // Retrieve subCategory
  const subCategory = await db.subCategory.findUnique({
    where: {
      id: subCategoryId,
    },
  });
  return subCategory;
};

// Function: deleteSubCategory
// Description: Deletes a SubCategory from the database.
// Permission Level: Admin only
// Parameters:
//   - SubCategoryId: The ID of the SubCategory to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteSubCategory = async (subCategoryId: string) => {
  // Get current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Verify admin permission
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry."
    );

  // Ensure subCategory ID is provided
  if (!subCategoryId) throw new Error("Please provide category ID.");

  // Delete subCategory from the database
  const response = await db.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });
  return response;
};

// Function: getSubcategories
// Description: Retrieves subcategories from the database, with options for limiting results and random selection.
// Parameters:
//   - limit: Number indicating the maximum number of subcategories to retrieve.
//   - random: Boolean indicating whether to return random subcategories.
// Returns: List of subcategories based on the provided options.
export const getSubcategories = async (
  limit: number | null,
  random: boolean = false
): Promise<SubCategory[]> => {
  // Define SortOrder enum
  enum SortOrder {
    asc = "asc",
    desc = "desc",
  }
  try {
    // Define the query options
    const queryOptions = {
      take: limit || undefined, // Use the provided limit or undefined for no limit
      orderBy: random ? { createdAt: SortOrder.desc } : undefined, // Use SortOrder for ordering
    };

    // If random selection is required, use a raw query to randomize
    if (random) {
      const subcategories = await db.$queryRaw<SubCategory[]>`
    SELECT * FROM SubCategory
    ORDER BY RAND()
    LIMIT ${limit || 10} 
    `;
      return subcategories;
    } else {
      // Otherwise, fetch subcategories based on the defined query options
      const subcategories = await db.subCategory.findMany(queryOptions);
      return subcategories;
    }
  } catch (error) {
    // Log and re-throw any errors
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

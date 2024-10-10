"use server";

// DB
import { db } from "@/lib/db";

// Types
import {
  ProductWithVariantType,
  VariantImageType,
  VariantSimplified,
} from "@/lib/types";
import { generateUniqueSlug } from "@/lib/utils";

// Clerk
import { currentUser } from "@clerk/nextjs/server";
import { create } from "domain";

// Slugify
import slugify from "slugify";

// Function: upsertProduct
// Description: Upserts a product and its variant into the database, ensuring proper association with the store.
// Access Level: Seller Only
// Parameters:
//   - product: ProductWithVariant object containing details of the product and its variant.
//   - storeUrl: The URL of the store to which the product belongs.
// Returns: Newly created or updated product with variant details.
export const upsertProduct = async (
  product: ProductWithVariantType,
  storeUrl: string
) => {
  try {
    // Retrieve current user
    const user = await currentUser();

    // Check if user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Ensure user has seller privileges
    if (user.privateMetadata.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry."
      );

    // Ensure product data is provided
    if (!product) throw new Error("Please provide product data.");

    // Check if the product already exists
    const existingProduct = await db.product.findUnique({
      where: { id: product.productId },
    });

    // Find the store by URL
    const store = await db.store.findUnique({ where: { url: storeUrl } });
    if (!store) throw new Error("Store not found.");

    // Generate unique slugs for product and variant
    const productSlug = await generateUniqueSlug(
      slugify(product.name, {
        replacement: "-",
        lower: true,
        trim: true,
      }),
      "product"
    );

    const variantSlug = await generateUniqueSlug(
      slugify(product.variantName, {
        replacement: "-",
        lower: true,
        trim: true,
      }),
      "productVariant"
    );

    // Common data for product and variant
    const commonProductData = {
      name: product.name,
      description: product.description,
      slug: productSlug,
      brand: product.brand,
      specs: {
        create: product.product_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      questions: {
        create: product.questions.map((question) => ({
          question: question.question,
          answer: question.answer,
        })),
      },
      store: { connect: { id: store.id } },
      category: { connect: { id: product.categoryId } },
      subCategory: { connect: { id: product.subCategoryId } },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    const commonVariantData = {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      slug: variantSlug,
      isSale: product.isSale,
      saleEndDate: product.isSale ? product.saleEndDate : "",
      sku: product.sku,
      keywords: product.keywords.join(","),
      specs: {
        create: product.variant_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      images: {
        create: product.images.map((image, index) => ({
          url: image.url,
          alt: image.url.split("/").pop() || "",
          createdAt: product.createdAt, // Ensuring the image creation time is consistent
          updatedAt: product.updatedAt, // Ensuring the image update time is consistent
          order: index, // Add order to maintain the original input sequence
        })),
      },
      variantImage: product.variantImage,
      colors: {
        create: product.colors.map((color) => ({
          name: color.color,
        })),
      },
      sizes: {
        create: product.sizes.map((size) => ({
          size: size.size,
          quantity: size.quantity,
          price: size.price,
          discount: size.discount,
        })),
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    // If product exists, create a variant
    if (existingProduct) {
      const variantData = {
        ...commonVariantData,
        product: { connect: { id: product.productId } },
      };
      return await db.productVariant.create({ data: variantData });
    } else {
      // Otherwise, create a new product with variants
      const productData = {
        ...commonProductData,
        id: product.productId,
        variants: {
          create: [
            {
              id: product.variantId,
              ...commonVariantData,
            },
          ],
        },
      };
      return await db.product.create({ data: productData });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getProductVariant
// Description: Retrieves details of a specific product variant from the database.
// Access Level: Public
// Parameters:
//   - productId: The id of the product to which the variant belongs.
//   - variantId: The id of the variant to be retrieved.
// Returns: Details of the requested product variant.
export const getProductVariant = async (
  productId: string,
  variantId: string
) => {
  // Retrieve product variant details from the database
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      category: true,
      subCategory: true,
      variants: {
        where: {
          id: variantId,
        },
        include: {
          images: true,
          colors: {
            select: {
              name: true,
            },
          },
          sizes: {
            select: {
              size: true,
              quantity: true,
              price: true,
              discount: true,
            },
          },
        },
      },
    },
  });
  if (!product) return;
  return {
    productId: product?.id,
    variantId: product?.variants[0].id,
    name: product.name,
    description: product?.description,
    variantName: product.variants[0].variantName,
    variantDescription: product.variants[0].variantDescription,
    images: product.variants[0].images,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId,
    isSale: product.variants[0].isSale,
    brand: product.brand,
    sku: product.variants[0].sku,
    colors: product.variants[0].colors,
    sizes: product.variants[0].sizes,
    keywords: product.variants[0].keywords.split(","),
  };
};

// Function: getProductMainInfo
// Description: Retrieves the main information of a specific product from the database.
// Access Level: Public
// Parameters:
//   - productId: The ID of the product to be retrieved.
// Returns: An object containing the main information of the product or null if the product is not found.
export const getProductMainInfo = async (productId: string) => {
  // Retrieve the product from the database
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) return null;

  // Return the main information of the product
  return {
    productId: product.id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId,
    storeId: product.storeId,
  };
};

// Function: getAllStoreProducts
// Description: Retrieves all products from a specific store based on the store URL.
// Access Level: Public
// Parameters:
//   - storeUrl: The URL of the store whose products are to be retrieved.
// Returns: Array of products from the specified store, including category, subcategory, and variant details.
export const getAllStoreProducts = async (storeUrl: string) => {
  // Retrieve store details from the database using the store URL
  const store = await db.store.findUnique({ where: { url: storeUrl } });
  if (!store) throw new Error("Please provide a valid store URL.");

  // Retrieve all products associated with the store
  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      category: true,
      subCategory: true,
      variants: {
        include: {
          images: { orderBy: { order: "asc" } },
          colors: true,
          sizes: true,
        },
      },
      store: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  return products;
};

// Function: deleteProduct
// Description: Deletes a product from the database.
// Permission Level: Seller only
// Parameters:
//   - productId: The ID of the product to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteProduct = async (productId: string) => {
  // Get current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Ensure user has seller privileges
  if (user.privateMetadata.role !== "SELLER")
    throw new Error(
      "Unauthorized Access: Seller Privileges Required for Entry."
    );

  // Ensure product data is provided
  if (!productId) throw new Error("Please provide product id.");

  // Delete product from the database
  const response = await db.product.delete({ where: { id: productId } });
  return response;
};

// Function: getProducts
// Description: Retrieves products based on various filters and returns only variants that match the filters. Supports pagination.
// Access Level: Public
// Parameters:
//   - filters: An object containing filter options (category, subCategory, offerTag, size, onSale, onDiscount, brand, color).
//   - sortBy: Sort the filtered results (Most popular, New Arivals, Top Rated...).
//   - page: The current page number for pagination (default = 1).
//   - pageSize: The number of products per page (default = 10).
// Returns: An object containing paginated products, filtered variants, and pagination metadata (totalPages, currentPage, pageSize, totalCount).
export const getProducts = async (
  filters: any = {},
  sortBy = "",
  page: number = 1,
  pageSize: number = 10
) => {
  // Default values for page and pageSize
  const currentPage = page;
  const limit = pageSize;
  const skip = (currentPage - 1) * limit;

  // Construct the base query
  const wherClause: any = {
    AND: [],
  };

  // Get all filtered, sorted products
  const products = await db.product.findMany({
    where: wherClause,
    take: limit, // Limit to page size
    skip: skip, // Skip the products of previous pages
    include: {
      variants: {
        include: {
          sizes: true,
          images: true,
          colors: true,
        },
      },
    },
  });

  // Transform the products with filtered variants into ProductCardType structure
  const productsWithFilteredVariants = products.map((product) => {
    // Filter the variants based on the filters
    const filteredVariants = product.variants;

    // Transform the filtered variants into the VariantSimplified structure
    const variants: VariantSimplified[] = filteredVariants.map((variant) => ({
      variantId: variant.id,
      variantSlug: variant.slug,
      variantName: variant.variantName,
      images: variant.images,
      sizes: variant.sizes,
    }));

    // Extract variant images for the product
    const variantImages: VariantImageType[] = filteredVariants.map(
      (variant) => ({
        url: `/product/${product.slug}/${variant.slug}`,
        image: variant.variantImage
          ? variant.variantImage
          : variant.images[0].url,
      })
    );

    // Return the product in the ProductCardType structure
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      rating: product.rating,
      sales: product.sales,
      variants,
      variantImages,
    };
  });

  /*
  const totalCount = await db.product.count({
    where: wherClause,
  });
  */

  const totalCount = products.length;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Return the paginated data along with metadata
  return {
    products: productsWithFilteredVariants,
    totalPages,
    currentPage,
    pageSize,
    totalCount,
  };
};

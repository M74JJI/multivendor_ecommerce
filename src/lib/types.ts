import { getAllStoreProducts, getProducts } from "@/queries/product";
import { getStoreDefaultShippingDetails } from "@/queries/store";
import { getAllSubCategories } from "@/queries/subCategory";
import {
  Prisma,
  ProductVariantImage,
  ShippingRate,
  Size,
} from "@prisma/client";
import countries from "@/data/countries.json";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

// SubCategory + parent category
export type SubCategoryWithCategoryType = Prisma.PromiseReturnType<
  typeof getAllSubCategories
>[0];

// Product + variant
export type ProductWithVariantType = {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  images: { url: string }[];
  variantImage: string;
  categoryId: string;
  offerTagId: string;
  subCategoryId: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  colors: { color: string }[];
  sizes: { size: string; quantity: number; price: number; discount: number }[];
  product_specs: { name: string; value: string }[];
  variant_specs: { name: string; value: string }[];
  keywords: string[];
  questions: { question: string; answer: string }[];
  createdAt: Date;
  updatedAt: Date;
};

// Store product
export type StoreProductType = Prisma.PromiseReturnType<
  typeof getAllStoreProducts
>[0];

// Store default shipping details
export type StoreDefaultShippingType = Prisma.PromiseReturnType<
  typeof getStoreDefaultShippingDetails
>;

export type CountryWithShippingRatesType = {
  countryId: string;
  countryName: string;
  shippingRate: ShippingRate;
};

export interface Country {
  name: string;
  code: string;
  city: string;
  region: string;
}

export type SelectMenuOption = (typeof countries)[number];

export type ProductType = Prisma.PromiseReturnType<
  typeof getProducts
>["products"][0];

export type VariantSimplified = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type VariantImageType = {
  url: string;
  image: string;
};

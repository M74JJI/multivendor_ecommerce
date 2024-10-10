"use server";

// DB
import { db } from "@/lib/db";
import {
  CountryWithShippingRatesType,
  StoreDefaultShippingType,
} from "@/lib/types";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Prisma models
import { ShippingRate, Store } from "@prisma/client";

// Function: upsertStore
// Description: Upserts store details into the database, ensuring uniqueness of name,url, email, and phone number.
// Access Level: Seller Only
// Parameters:
//   - store: Partial store object containing details of the store to be upserted.
// Returns: Updated or newly created store details.
export const upsertStore = async (store: Store) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify seller permission
    if (user.privateMetadata.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry."
      );

    // Ensure store data is provided
    if (!store) throw new Error("Please provide store data.");

    // Check if store with same name, email,url, or phone number already exists
    const existingStore = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: store.name },
              { email: store.email },
              { phone: store.phone },
              { url: store.url },
            ],
          },
          {
            NOT: {
              id: store.id,
            },
          },
        ],
      },
    });

    // If a store with same name, email, or phone number already exists, throw an error
    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage = "A store with the same name already exists";
      } else if (existingStore.email === store.email) {
        errorMessage = "A store with the same email already exists";
      } else if (existingStore.phone === store.phone) {
        errorMessage = "A store with the same phone number already exists";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert store details into the database
    const storeDetails = await db.store.upsert({
      where: {
        id: store.id,
      },
      update: store,
      create: {
        ...store,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return storeDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getStoreDefaultShippingDetails
// Description: Fetches the default shipping details for a store based on the store URL.
// Parameters:
//   - storeUrl: The URL of the store to fetch default shipping details for.
// Returns: An object containing default shipping details, including shipping service, fees, delivery times, and return policy.
export const getStoreDefaultShippingDetails = async (storeUrl: string) => {
  try {
    // Ensure the store URL is provided
    if (!storeUrl) throw new Error("Store URL is required.");

    // Fetch the store and its default shipping details
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
      select: {
        defaultShippingService: true,
        defaultShippingFeePerItem: true,
        defaultShippingFeeForAdditionalItem: true,
        defaultShippingFeePerKg: true,
        defaultShippingFeeFixed: true,
        defaultDeliveryTimeMin: true,
        defaultDeliveryTimeMax: true,
        returnPolicy: true,
      },
    });

    // Throw an error if the store is not found
    if (!store) throw new Error("Store not found.");

    return store;
  } catch (error) {
    // Log and re-throw any errors
    console.log(error);
    throw error;
  }
};

// Function: updateStoreDefaultShippingDetails
// Description: Updates the default shipping details for a store based on the store URL.
// Parameters:
//   - storeUrl: The URL of the store to update.
//   - details: An object containing the new shipping details (shipping service, fees, delivery times, and return policy).
// Returns: The updated store object with the new default shipping details.
export const updateStoreDefaultShippingDetails = async (
  storeUrl: string,
  details: StoreDefaultShippingType
) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify seller permission
    if (user.privateMetadata.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry."
      );

    // Ensure the store URL is provided
    if (!storeUrl) throw new Error("Store URL is required.");

    // Ensure at least one detail is provided for update
    if (!details) {
      throw new Error("No shipping details provided to update.");
    }
    // Make sure seller is updating their own store
    const check_ownership = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!check_ownership)
      throw new Error(
        "Make sure you have the permissions to update this store"
      );

    // Find and update the store based on storeUrl
    const updatedStore = await db.store.update({
      where: {
        url: storeUrl,
        userId: user.id,
      },
      data: details,
    });

    return updatedStore;
  } catch (error) {
    // Log and re-throw any errors
    console.log(error);
    throw error;
  }
};

/**
 * Function: getStoreShippingRates
 * Description: Retrieves all countries and their shipping rates for a specific store.
 *              If a country does not have a shipping rate, it is still included in the result with a null shippingRate.
 * Permission Level: Public
 * Returns: Array of objects where each object contains a country and its associated shippingRate, sorted by country name.
 */
export const getStoreShippingRates = async (storeUrl: string) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify seller permission
    if (user.privateMetadata.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry."
      );

    // Ensure the store URL is provided
    if (!storeUrl) throw new Error("Store URL is required.");

    // Make sure seller is updating their own store
    const check_ownership = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!check_ownership)
      throw new Error(
        "Make sure you have the permissions to update this store"
      );

    // Get store details
    const store = await db.store.findUnique({
      where: { url: storeUrl, userId: user.id },
    });

    if (!store) throw new Error("Store could not be found.");

    // Retrieve all countries
    const countries = await db.country.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Retrieve all shipping rates for the specified store
    const shippingRates = await db.shippingRate.findMany({
      where: {
        storeId: store.id,
      },
    });

    // Create a map for quick lookup of shipping rates by country ID
    const rateMap = new Map();
    shippingRates.forEach((rate) => {
      rateMap.set(rate.countryId, rate);
    });

    // Map countries to their shipping rates
    const result = countries.map((country) => ({
      countryId: country.id,
      countryName: country.name,
      shippingRate: rateMap.get(country.id) || null,
    }));

    return result;
  } catch (error) {
    console.error("Error retrieving store shipping rates:", error);
    throw error;
  }
};

// Function: upsertShippingRate
// Description: Upserts a shipping rate for a specific country, updating if it exists or creating a new one if not.
// Permission Level: Seller only
// Parameters:
//   - storeUrl: Url of the store you are trying to update.
//   - shippingRate: ShippingRate object containing the details of the shipping rate to be upserted.
// Returns: Updated or newly created shipping rate details.
export const upsertShippingRate = async (
  storeUrl: string,
  shippingRate: ShippingRate
) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify seller permission
    if (user.privateMetadata.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry."
      );

    // Make sure seller is updating their own store
    const check_ownership = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!check_ownership)
      throw new Error(
        "Make sure you have the permissions to update this store"
      );

    // Ensure shipping rate data is provided
    if (!shippingRate) throw new Error("Please provide shipping rate data.");

    // Ensure countryId is provided
    if (!shippingRate.countryId)
      throw new Error("Please provide a valid country ID.");

    // Get store id
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });
    if (!store) throw new Error("Please provide a valid store URL.");

    // Upsert the shipping rate into the database
    const shippingRateDetails = await db.shippingRate.upsert({
      where: {
        id: shippingRate.id,
      },
      update: { ...shippingRate, storeId: store.id },
      create: { ...shippingRate, storeId: store.id },
    });

    return shippingRateDetails;
  } catch (error) {
    // Log and re-throw any errors
    console.log(error);
    throw error;
  }
};

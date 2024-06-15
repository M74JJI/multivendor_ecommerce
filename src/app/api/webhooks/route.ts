import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import { db } from "@/lib/db";
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }
  // When user is created or updated
  if (evt.type === "user.created" || evt.type === "user.updated") {
    // Parse the incoming event data
    const data = JSON.parse(body).data;

    // Create a user object with relevant properties
    const user: Partial<User> = {
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0].email_address,
      picture: data.image_url,
    };
    // If user data is invalid, exit the function
    if (!user) return;

    // Upsert user in the database (update if exists, create if not)
    const dbUser = await db.user.upsert({
      where: {
        email: user.email,
      },
      update: user,
      create: {
        id: user.id!,
        name: user.name!,
        email: user.email!,
        picture: user.picture!,
        role: user.role || "USER", // Default role to "USER" if not provided
      },
    });

    // Update user's metadata in Clerk with the role information
    await clerkClient.users.updateUserMetadata(data.id, {
      privateMetadata: {
        role: dbUser.role || "USER", // Default role to "USER" if not present in dbUser
      },
    });
  }

  // When user is deleted
  if (evt.type === "user.deleted") {
    // Parse the incoming event data to get the user ID
    const userId = JSON.parse(body).data.id;

    // Delete the user from the database based on the user ID
    await db.user.delete({
      where: {
        id: userId,
      },
    });
  }

  return new Response("", { status: 200 });
}

import crypto from "node:crypto";
import { processWebhookEvent, storeWebhookEvent } from "@/utils/lemonsqueezy/server";
import { webhookHasMeta } from "@/lib/typeguards";

export async function POST(request: Request) {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    console.error("api/lemonsqueezy: Lemon Squeezy Webhook Secret not set in .env");
    return new Response("Lemon Squeezy Webhook Secret not set in .env", {
      status: 500,
    });
  }

  // api/lemonsqueezy: First, make sure the request is from Lemon Squeezy.
  const rawBody = await request.text();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  console.log("api/lemonsqueezy: Raw body received for verification:", rawBody);

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(
    request.headers.get("X-Signature") ?? "",
    "utf8",
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    console.error("api/lemonsqueezy: Invalid signature received.");
    return new Response("Invalid signature", { status: 400 });
  }

  const data = JSON.parse(rawBody) as unknown;
  console.log("api/lemonsqueezy: Parsed data:", data);

  // api/lemonsqueezy: Type guard to check if the object has a 'meta' property.
  if (webhookHasMeta(data)) {
    console.log("api/lemonsqueezy: Valid webhook meta found, storing event.");
    const webhookEventId = await storeWebhookEvent(data.meta.event_name, data);

    // api/lemonsqueezy: Non-blocking call to process the webhook event.
    console.log("api/lemonsqueezy: Processing webhook event with ID:", webhookEventId);
    void processWebhookEvent(webhookEventId);

    return new Response("OK", { status: 200 });
  }

  console.error("api/lemonsqueezy: Data invalid, no valid meta found.");
  return new Response("Data invalid", { status: 400 });
}
/* eslint-disable @typescript-eslint/no-non-null-assertion -- checked in configureLemonSqueezy() */
"use server";

import crypto from "node:crypto";
import {
  cancelSubscription,
  createCheckout,
  createWebhook,
  getPrice,
  getProduct,
  getSubscription,
  listPrices,
  listProducts,
  listWebhooks,
  updateSubscription,
  type Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/app/supabase-server";
import { Database } from "@/types/db";
import { configureLemonSqueezy } from "./config";
import { webhookHasData, webhookHasMeta } from "@/lib/typeguards";
import { auth, signOut } from "./auth";
import { createClient } from "@supabase/supabase-js";

type Tables = Database['public']['Tables'];
type NewSubscription = Tables['subscriptions']['Insert'];
type NewWebhookEvent = Tables['webhook_events']['Insert'];
type NewPlan = Tables['plan']['Insert'];

import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'
import { string } from "zod";

const lemonSqueezyBaseUrl = 'https://api.lemonsqueezy.com/v1';
const lemonSqueezyApiKey = process.env.LEMONSQUEEZY_API_KEY;

/**
 * This action will log out the current user.
 */
export async function logout() {
  await signOut();
}

/**
 * Get product variants.
 */

function createHeaders() {
  const headers = new Headers();
  headers.append('Accept', 'application/vnd.api+json');
  headers.append('Content-Type', 'application/vnd.api+json');
  headers.append('Authorization', `Bearer ${lemonSqueezyApiKey}`);
  return headers;
}

function createRequestOptions(method: string, headers: Headers): RequestInit {
  return {
      method,
      headers,
      redirect: 'follow',
      cache: "no-store"
  };
}


export async function getProductVariants(productId: string) {
  const url = `${lemonSqueezyBaseUrl}/variants?filter[product_id]=${productId}`;
  const headers = createHeaders();
  const requestOptions = createRequestOptions('GET', headers);

  const response: Response = await fetch(url, requestOptions);
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
* Create a checkout on Lemon Squeezy.
*/
export async function getCheckoutURL(variantId: number, embed = false) {
configureLemonSqueezy();

const session = await auth();

if (!session?.user) {
  throw new Error("User is not authenticated.");
}

const checkout = await createCheckout(
  process.env.LEMONSQUEEZY_STORE_ID!,
  variantId,
  {
    checkoutOptions: {
      embed,
      media: false,
      logo: !embed,
    },
    checkoutData: {
      email: session.user.email ?? undefined,
      custom: {
        user_id: session.user.id,
      },
    },
    productOptions: {
      enabledVariants: [variantId],
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/`,
      receiptButtonText: "Go to Dashboard",
      receiptThankYouNote: "Thank you for signing up to Lemon Stand!",
    },
  },
);

return checkout.data?.data.attributes.url;
}




export async function hasWebhook() {
  configureLemonSqueezy();

  if (!process.env.WEBHOOK_URL) {
    throw new Error(
      "Missing required WEBHOOK_URL env variable. Please, set it in your .env file.",
    );
  }

  // Check if a webhook exists on Lemon Squeezy.
  const allWebhooks = await listWebhooks({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
  });

  // Check if WEBHOOK_URL ends with a slash. If not, add it.
  let webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl.endsWith("/")) {
    webhookUrl += "/";
  }
  webhookUrl += "api/webhooks/lemonsqueezy";

  const webhook = allWebhooks.data?.data.find(
    (wh) => wh.attributes.url === webhookUrl && wh.attributes.test_mode,
  );

  return webhook;
}

export async function setupWebhook() {
  configureLemonSqueezy();

  if (!process.env.WEBHOOK_URL) {
    throw new Error(
      "Missing required WEBHOOK_URL env variable. Please, set it in your .env file.",
    );
  }

  // Check if WEBHOOK_URL ends with a slash. If not, add it.
  let webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl.endsWith("/")) {
    webhookUrl += "/";
  }
  webhookUrl += "api/webhook";

  // eslint-disable-next-line no-console -- allow
  console.log("Setting up a webhook on Lemon Squeezy (Test Mode)...");

  // Do not set a webhook on Lemon Squeezy if it already exists.
  let webhook = await hasWebhook();

  // If the webhook does not exist, create it.
  if (!webhook) {
    const newWebhook = await createWebhook(process.env.LEMONSQUEEZY_STORE_ID!, {
      secret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
      url: webhookUrl,
      testMode: true, // will create a webhook in Test mode only!
      events: [
        "subscription_created",
        "subscription_expired",
        "subscription_updated",
      ],
    });

    webhook = newWebhook.data?.data;
  }

  // eslint-disable-next-line no-console -- allow
  console.log(`Webhook ${webhook?.id} created on Lemon Squeezy.`);
}


export async function syncPlans() {
  configureLemonSqueezy()

  const supabase = createServerSupabaseClient()

  // Fetch all the plans from the database.
  const { data: existingPlans, error } = await supabase
    .from('plan')
    .select('*')

  if (error) {
    console.error('Error fetching plans:', error)
    throw error
  }

  // Helper function to add a plan to the database.
  async function _addPlan(plan: NewPlan) {
    console.log(`Syncing plan ${plan.name} with the database...`)

    const { error } = await supabase
      .from('plan')
      .upsert(plan, { onConflict: 'variantId' })

    if (error) {
      console.error(`Error syncing ${plan.name}:`, error)
      throw error
    }

    console.log(`${plan.name} synced with the database...`)
  }

  // Fetch products from the Lemon Squeezy store.
  const products = await listProducts({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    include: ['variants'],
  })

  // Loop through all the variants.
  const allVariants = products.data?.included as Variant['data'][] | undefined

  if (allVariants) {
    for (const v of allVariants) {
      const variant = v.attributes

      // Skip draft variants or if there's more than one variant, skip the default variant.
      if (
        variant.status === 'draft' ||
        (allVariants.length !== 1 && variant.status === 'pending')
      ) {
        continue
      }

      // Fetch the Product name.
      const productName =
        (await getProduct(variant.product_id)).data?.data.attributes.name ?? ''

      // Fetch the Price object.
      const variantPriceObject = await listPrices({
        filter: {
          variantId: v.id,
        },
      })

      const currentPriceObj = variantPriceObject.data?.data.at(0)
      const isUsageBased =
        currentPriceObj?.attributes.usage_aggregation !== null
      const interval = currentPriceObj?.attributes.renewal_interval_unit
      const intervalCount =
        currentPriceObj?.attributes.renewal_interval_quantity
      const trialInterval = currentPriceObj?.attributes.trial_interval_unit
      const trialIntervalCount =
        currentPriceObj?.attributes.trial_interval_quantity

      const price = isUsageBased
        ? currentPriceObj?.attributes.unit_price_decimal
        : currentPriceObj?.attributes.unit_price

      const priceString = price !== null ? price?.toString() ?? '' : ''

      const isSubscription =
        currentPriceObj?.attributes.category === 'subscription'

      // If not a subscription, skip it.
      if (!isSubscription) {
        continue
      }

      await _addPlan({
        product_id: variant.product_id,
        product_name: productName,
        variant_id: parseInt(v.id),
        name: variant.name,
        description: variant.description,
        price: priceString,
        is_usage_based: isUsageBased,
        interval: interval,
        interval_count: intervalCount,
        trial_interval: trialInterval,
        trial_interval_count: trialIntervalCount,
        sort: variant.sort,
      })
    }
  }

  return existingPlans
}

/**
 * This action will store a webhook event in the database.
 * @param eventName - The name of the event.
 * @param body - The body of the event.
 */
export async function storeWebhookEvent(
  eventName: string,
  body: NewWebhookEvent["data"],
) {
  const supabase = createServerSupabaseClient();

  const id = crypto.randomInt(100000000, 1000000000);

  const { data, error } = await supabase
    .from('webhook_events')
    .insert({
      id,
      event_type: eventName,
      processed: false,
      data: body,
      event_id: id.toString(),
      payment_provider: 'unknown',
      created_at: new Date().toISOString(),
      api_version: null,
      processing_error: null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function processWebhookEvent(webhookEvent: NewWebhookEvent) {
  configureLemonSqueezy();
  const supabase = createServerSupabaseClient();

  const { data: dbWebhookEvent, error: fetchError } = await supabase
    .from('webhook_events')
    .select()
    .eq('id', webhookEvent.id as number) // Ensure webhookEvent.id is treated as a number
    .single();

  if (fetchError || !dbWebhookEvent) {
    throw new Error(
      `Webhook event #${webhookEvent.id} not found in the database.`,
    );
  }

  if (!process.env.WEBHOOK_URL) {
    throw new Error(
      "Missing required WEBHOOK_URL env variable. Please, set it in your .env file.",
    );
  }
  let processingError = "";
  const eventBody = webhookEvent.data;

  if (!webhookHasMeta(eventBody)) {
    processingError = "Event body is missing the 'meta' property.";
  } else if (webhookHasData(eventBody)) {
    if (webhookEvent.event_type.startsWith("subscription_payment_")) {
      // Save subscription invoices; eventBody is a SubscriptionInvoice
      // Not implemented.
    } else if (webhookEvent.event_type.startsWith("subscription_")) {
      const attributes = eventBody.data.attributes;
      const variantId = attributes.variant_id as number;
      const { data: plan, error: planError } = await supabase
        .from('plan')
        .select()
        .eq('variantId', variantId)
        .single();

      if (planError || !plan) {
        processingError = `Plan with variantId ${variantId} not found.`;
      } else {
        // Update the subscription in the database.
        const priceId = attributes.first_subscription_item.price_id;

        // Get the price data from Lemon Squeezy.
        const priceData = await getPrice(priceId);
        if (priceData.error) {
          processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
        }

        const isUsageBased = attributes.first_subscription_item.is_usage_based;
        const price = isUsageBased
          ? priceData.data?.data.attributes.unit_price_decimal
          : priceData.data?.data.attributes.unit_price;

        const updateData: NewSubscription = {
          lemon_squeezy_id: eventBody.data.id,
          order_id: attributes.order_id as number,
          name: attributes.user_name as string,
          email: attributes.user_email as string,
          status: attributes.status as string,
          status_formatted: attributes.status_formatted as string,
          renews_at: attributes.renews_at as string,
          ends_at: attributes.ends_at as string,
          trial_ends_at: attributes.trial_ends_at as string,
          price: price?.toString() ?? "",
          is_paused: false,
          is_usage_based: attributes.first_subscription_item.is_usage_based,
          subscription_item_id: attributes.first_subscription_item.id,
          user_id: eventBody.meta.custom_data.user_id,
          plan_id: plan.id, // Changed from plan[0].id to plan.id
        };

        // Create/update subscription in the database.
        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert(updateData, {
            onConflict: 'lemon_squeezy_id',
          });

        if (upsertError) {
          processingError = `Failed to upsert Subscription #${updateData.lemon_squeezy_id} to the database.`;
          console.error(upsertError);
        }
      }
    } else if (webhookEvent.event_type.startsWith("order_")) {
      // Save orders; eventBody is a "Order"
      /* Not implemented */
    } else if (webhookEvent.event_type.startsWith("license_")) {
      // Save license keys; eventBody is a "License key"
      /* Not implemented */
    }

    // Update the webhook event in the database.
    const { error: updateError } = await supabase
      .from('webhook_events')
      .update({
        processed: true,
        processing_error: processingError ?? null,
      })
      .eq('id', webhookEvent.id as number);

    if (updateError) {
      console.error('Failed to update webhook event:', updateError);
    }
  }
}
/* eslint-disable @typescript-eslint/no-non-null-assertion -- checked in configureLemonSqueezy() */
"use server";

import { SupabaseClient } from '@supabase/supabase-js';
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
type SubscriptionAttributes = {
  id: string;
  order_id: number;
  user_name: string;
  user_email: string;
  status: string;
  status_formatted: string;
  renews_at: string | null;
  ends_at: string | null;
  trial_ends_at: string | null;
  variant_id: number;
  pause: any;
  first_subscription_item: {
    id: number;
    price_id: number;
    is_usage_based: boolean;
    price: number | string;
  };
};


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
* ---------------------- GET PRODUCT VARIANTS ----------------------
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
* ---------------------- CHECKOUT ----------------------
*/
export async function getCheckoutURL(variant_id: number, embed = false) {
  configureLemonSqueezy();

  const user = await auth();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const checkout = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    variant_id,
    {
      checkoutOptions: {
        embed,
        media: false,
        logo: !embed,
      },
      checkoutData: {
        email: user.email ?? undefined,
        custom: {
          user_id: user.id,
        },
      },
      productOptions: {
        enabledVariants: [variant_id],
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account/`,
        receiptButtonText: "Go to Dashboard",
        receiptThankYouNote: "Thank you for signing up to Lemon Stand!",
      },
    },
  );

  return checkout.data?.data.attributes.url;
}

/**
* ---------------------- SETTING UP WEBHOOK ----------------------
*/

export async function hasWebhook() {
  configureLemonSqueezy();

  if (!process.env.WEBHOOK_URL || !process.env.LEMONSQUEEZY_STORE_ID) {
    throw new Error(
      `Missing required env variable(s): ${!process.env.WEBHOOK_URL ? 'WEBHOOK_URL' : ''} ${!process.env.LEMONSQUEEZY_STORE_ID ? 'LEMONSQUEEZY_STORE_ID' : ''}. Please, set them in your .env file.`
    );
  }

  // Check if a webhook exists on Lemon Squeezy.
  const allWebhooks = await listWebhooks();

  // Check if WEBHOOK_URL ends with a slash. If not, add it.
  let webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl.endsWith("/")) {
    webhookUrl += "/";
  }
  webhookUrl += "api/webhooks/lemonsqueezy";

  // Filter the webhooks based on the store ID manually
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const filteredWebhooks = allWebhooks.data?.data.filter(
    webhook => webhook.attributes.store_id.toString() === storeId
  );

  console.log("filteredWebhooks", filteredWebhooks);

  // Find the specific webhook we're looking for
  const webhook = filteredWebhooks?.find(
    (wh) => wh.attributes.url === webhookUrl && wh.attributes.test_mode
  );

  console.log("Webhook", webhook);

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
  webhookUrl += "api/webhooks/lemonsqueezy";

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

/**
* ---------------------- SYNC PLANS FROM VARIANTS TO DATABASE ----------------------
*/
export async function syncPlans() {
  configureLemonSqueezy()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
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
      .upsert(plan, { onConflict: 'variant_id' })

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
 * ---------------------- STORE WEBHOOK EVENT ----------------------
 * @param eventName - The name of the event.
 * @param body - The body of the event.
 */
export async function storeWebhookEvent(
  eventName: string,
  body: NewWebhookEvent["data"],
) {
  console.log(`Storing webhook event: ${eventName}`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const id = crypto.randomInt(100000000, 1000000000);

  console.log(`Generated ID for webhook event: ${id}`);

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

  if (error) {
    console.error(`Error storing webhook event: ${error.message}`);
    throw error;
  }
  console.log(`Successfully stored webhook event with ID: ${data.id}`);
  return data;
}


/**
* ---------------------- PROCESS WEBHOOK EVENT ----------------------
*/
export async function processWebhookEvent(webhookEvent: NewWebhookEvent) {
  console.log(`Processing webhook event: ${webhookEvent.id}`);
  configureLemonSqueezy();

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  let processingError = "";
  const eventBody = webhookEvent.data;

  if (!webhookHasMeta(eventBody) || !webhookHasData(eventBody)) {
    processingError = "Invalid webhook data structure.";
    console.error(processingError);
    return;
  }

  const eventType = webhookEvent.event_type;
  const attributes = eventBody.data.attributes as SubscriptionAttributes;
  const subscriptionId = eventBody.data.id;

  console.log(`Processing ${eventType} for subscription ${subscriptionId}`);

  try {
    switch (eventType) {
      case 'subscription_created':
        await handleSubscriptionCreated(supabase, subscriptionId, attributes, eventBody);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdate(supabase, subscriptionId, attributes, eventBody);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancellation(supabase, subscriptionId, attributes);
        break;
      case 'subscription_resumed':
        await handleSubscriptionResume(supabase, subscriptionId, attributes);
        break;
      case 'subscription_paused':
        await handleSubscriptionPause(supabase, subscriptionId, attributes);
        break;
      case 'subscription_unpaused':
        await handleSubscriptionUnpause(supabase, subscriptionId, attributes);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    processingError = `Error processing ${eventType}: ${(error as Error).message}`;
    console.error(processingError);
  }

  // Update the webhook event in the database
  await updateWebhookEventStatus(supabase, webhookEvent.id as number, processingError);
}


async function handleSubscriptionCreated(
  supabase: SupabaseClient<Database>,
  subscriptionId: string,
  attributes: SubscriptionAttributes,
  eventBody: any
) {
  const { data: currentPlan, error: planError } = await supabase
    .from('plan')
    .select('id')
    .eq('variant_id', attributes.variant_id)
    .single();

  if (planError || !currentPlan) {
    throw new Error(`Failed to fetch plan for variant ${attributes.variant_id}`);
  }

  const priceId = attributes.first_subscription_item.price_id;
  const priceData = await getPrice(priceId);
  if (priceData.error) {
    throw new Error(`Failed to get the price data for the subscription ${subscriptionId}`);
  }

  const isUsageBased = attributes.first_subscription_item.is_usage_based;
  const price = isUsageBased
    ? priceData.data?.data.attributes.unit_price_decimal
    : priceData.data?.data.attributes.unit_price;

  const newSubscription: NewSubscription = {
    lemon_squeezy_id: subscriptionId,
    order_id: attributes.order_id as number,
    name: attributes.user_name as string,
    email: attributes.user_email as string,
    status: attributes.status,
    status_formatted: attributes.status_formatted,
    renews_at: attributes.renews_at,
    ends_at: attributes.ends_at,
    trial_ends_at: attributes.trial_ends_at,
    price: price?.toString() ?? "",
    is_paused: false,
    subscription_item_id: attributes.first_subscription_item.id,
    is_usage_based: attributes.first_subscription_item.is_usage_based,
    user_id: eventBody.meta.custom_data.user_id,
    plan_id: currentPlan.id,
  };

  const { error } = await supabase
    .from('subscriptions')
    .insert(newSubscription);

  if (error) {
    throw new Error(`Failed to create subscription ${subscriptionId}: ${error.message}`);
  }

  console.log(`Successfully created subscription ${subscriptionId}`);
}

async function handleSubscriptionUpdate(
  supabase: SupabaseClient<Database>,
  subscriptionId: string,
  attributes: SubscriptionAttributes,
  eventBody: any
) {
  const { data: currentPlan, error: planError } = await supabase
    .from('plan')
    .select('id')
    .eq('variant_id', attributes.variant_id)
    .single();

  if (planError || !currentPlan) {
    throw new Error(`Failed to fetch plan for variant ${attributes.variant_id}`);
  }

  const priceId = attributes.first_subscription_item.price_id;
  const priceData = await getPrice(priceId);
  if (priceData.error) {
    throw new Error(`Failed to get the price data for the subscription ${subscriptionId}`);
  }

  const isUsageBased = attributes.first_subscription_item.is_usage_based;
  const price = isUsageBased
    ? priceData.data?.data.attributes.unit_price_decimal
    : priceData.data?.data.attributes.unit_price;

  const updateData: NewSubscription = {
    lemon_squeezy_id: subscriptionId,
    order_id: attributes.order_id as number,
    name: attributes.user_name as string,
    email: attributes.user_email as string,
    status: attributes.status,
    status_formatted: attributes.status_formatted,
    renews_at: attributes.renews_at,
    ends_at: attributes.ends_at,
    trial_ends_at: attributes.trial_ends_at,
    price: price?.toString() ?? "",
    is_paused: false,
    subscription_item_id: attributes.first_subscription_item.id,
    is_usage_based: attributes.first_subscription_item.is_usage_based,
    user_id: eventBody.meta.custom_data.user_id,
    plan_id: currentPlan.id,
  };

  console.log("handleSubscriptionUpdate updateData:", updateData);

  const { error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('lemon_squeezy_id', subscriptionId);

  if (error) {
    throw new Error(`Failed to update subscription ${subscriptionId}: ${error.message}`);
  }

  console.log(`Successfully updated subscription ${subscriptionId}`);
}

async function handleSubscriptionCancellation(
  supabase: SupabaseClient<Database>,
  subscriptionId: string,
  attributes: SubscriptionAttributes
) {
  const updateData = {
    status: attributes.status,
    status_formatted: attributes.status_formatted,
    ends_at: attributes.ends_at,
  };

  await updateSubscriptionInDatabase(supabase, subscriptionId, updateData);
}

async function handleSubscriptionResume(
  supabase: SupabaseClient<Database>,
  subscriptionId: string,
  attributes: SubscriptionAttributes
) {
  const updateData = {
    status: attributes.status,
    status_formatted: attributes.status_formatted,
    ends_at: attributes.ends_at,
    is_paused: false,
  };

  await updateSubscriptionInDatabase(supabase, subscriptionId, updateData);
}

async function handleSubscriptionPause(
  supabase: SupabaseClient<Database>,
  subscriptionId: string,
  attributes: SubscriptionAttributes
) {
  const updateData = {
    status: attributes.status,
    status_formatted: attributes.status_formatted,
    ends_at: attributes.ends_at,
    is_paused: attributes.pause !== null,
  };

  await updateSubscriptionInDatabase(supabase, subscriptionId, updateData);
}

async function handleSubscriptionUnpause(
  supabase: SupabaseClient<Database>,
  subscriptionId: string,
  attributes: SubscriptionAttributes
) {
  const updateData = {
    status: attributes.status,
    status_formatted: attributes.status_formatted,
    ends_at: attributes.ends_at,
    is_paused: false,
  };

  await updateSubscriptionInDatabase(supabase, subscriptionId, updateData);
}

async function updateSubscriptionInDatabase(
  supabase: SupabaseClient<Database>,
  subscriptionId: string,
  updateData: Partial<Tables['subscriptions']['Update']>
) {
  const { error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('lemon_squeezy_id', subscriptionId);

  if (error) {
    throw new Error(`Failed to update subscription ${subscriptionId}: ${error.message}`);
  }

  console.log(`Successfully updated subscription ${subscriptionId}`);
}

async function updateWebhookEventStatus(
  supabase: SupabaseClient<Database>,
  eventId: number,
  processingError: string
) {
  const { error } = await supabase
    .from('webhook_events')
    .update({
      processed: true,
      processing_error: processingError || null,
    })
    .eq('id', eventId);

  if (error) {
    console.error(`Failed to update webhook event ${eventId}:`, error);
  } else {
    console.log(`Successfully updated webhook event ${eventId}`);
  }
}

/**
 * ---------------------- GET USER SUBSCRIPTIONS ----------------------
 */
export async function getUserSubscriptions() {
  const user = await auth();
  const userId = user?.id;

  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  const supabase = createServerSupabaseClient();
  const { data: userSubscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user subscriptions:', error);
    throw error;
  }

  return userSubscriptions as NewSubscription[];
}

/**
 * This action will get the subscription URLs (update_payment_method and
 * customer_portal) for the given subscription ID.
 */
export async function getSubscriptionURLs(id: string) {
  configureLemonSqueezy();
  const subscription = await getSubscription(id);

  if (subscription.error) {
    throw new Error(subscription.error.message);
  }

  return subscription.data?.data.attributes.urls;
}

/**
 * This action will get the signed customer portal URL for the given subscription ID.
 */

export async function getSignedCustomerPortalURL(subscriptionId: string) {
  configureLemonSqueezy();
  const subscription = await getSubscription(subscriptionId);

  if (subscription.error) {
    throw new Error(subscription.error.message);
  }

  return subscription.data?.data.attributes.urls.customer_portal;
}

/**
 * This action will cancel a subscription on Lemon Squeezy.
 */
export async function cancelSub(id: string) {
  configureLemonSqueezy();

  // Get user subscriptions
  const userSubscriptions = await getUserSubscriptions();

  // Check if the subscription exists
  const subscription = userSubscriptions.find(
    (sub) => sub.lemon_squeezy_id === id,
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const cancelledSub = await cancelSubscription(id);

  if (cancelledSub.error) {
    throw new Error(cancelledSub.error.message);
  }

  // Update the db
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: cancelledSub.data?.data.attributes.status,
      status_formatted: cancelledSub.data?.data.attributes.status_formatted,
      ends_at: cancelledSub.data?.data.attributes.ends_at,
    })
    .eq('lemon_squeezy_id', id);

  if (error) {
    throw new Error(`Failed to cancel Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return cancelledSub;
}

/**
 * This action will pause a subscription on Lemon Squeezy.
 */
export async function pauseUserSubscription(id: string) {
  configureLemonSqueezy();

  // Get user subscriptions
  const userSubscriptions = await getUserSubscriptions();

  // Check if the subscription exists
  const subscription = userSubscriptions.find(
    (sub) => sub.lemon_squeezy_id === id,
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const returnedSub = await updateSubscription(id, {
    pause: {
      mode: "void",
    },
  });

  // Update the db
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
 
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: returnedSub.data?.data.attributes.status,
      status_formatted: returnedSub.data?.data.attributes.status_formatted,
      ends_at: returnedSub.data?.data.attributes.ends_at,
      is_paused: returnedSub.data?.data.attributes.pause !== null,
    })
    .eq('lemon_squeezy_id', id);

  if (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return returnedSub;
}

/**
 * This action will unpause a subscription on Lemon Squeezy.
 */
export async function unpauseUserSubscription(id: string) {
  configureLemonSqueezy();

  // Get user subscriptions
  const userSubscriptions = await getUserSubscriptions();

  // Check if the subscription exists
  const subscription = userSubscriptions.find(
    (sub) => sub.lemon_squeezy_id === id,
  );

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const returnedSub = await updateSubscription(id, {
    // @ts-expect-error -- null is a valid value for pause
    pause: null,
  });

  // Update the db
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: returnedSub.data?.data.attributes.status,
      status_formatted: returnedSub.data?.data.attributes.status_formatted,
      ends_at: returnedSub.data?.data.attributes.ends_at,
      is_paused: returnedSub.data?.data.attributes.pause !== null,
    })
    .eq('lemon_squeezy_id', id);

  if (error) {
    throw new Error(`Failed to unpause Subscription #${id} in the database.`);
  }

  revalidatePath("/");

  return returnedSub;
}

/**
 * This action will change the plan of a subscription on Lemon Squeezy.
 */
export async function changePlan(currentPlanId: number, newPlanId: number) {
  configureLemonSqueezy();

  // Get user subscriptions
  const userSubscriptions = await getUserSubscriptions();

  // Check if the subscription exists
  const subscription = userSubscriptions.find(
    (sub) => sub.plan_id === currentPlanId,
  );

  if (!subscription) {
    throw new Error(
      `No subscription with plan id #${currentPlanId} was found.`,
    );
  }

  // Get the new plan details from the database.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const { data: newPlan, error: planError } = await supabase
    .from('plan')
    .select('*')
    .eq('id', newPlanId)
    .single();

  if (planError || !newPlan) {
    throw new Error(`Failed to fetch plan with id #${newPlanId}`);
  }

  // Send request to Lemon Squeezy to change the subscription.
  const updatedSub = await updateSubscription(subscription.lemon_squeezy_id, {
    variantId: newPlan.variant_id,
  });

  // Save in db
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      plan_id: newPlanId,
      price: newPlan.price,
      ends_at: updatedSub.data?.data.attributes.ends_at,
    })
    .eq('lemon_squeezy_id', subscription.lemon_squeezy_id);

  if (updateError) {
    throw new Error(
      `Failed to update Subscription #${subscription.lemon_squeezy_id} in the database.`,
    );
  }

  revalidatePath("/");

  return updatedSub;
}
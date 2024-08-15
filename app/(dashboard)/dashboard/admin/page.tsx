import { getProductVariants, hasWebhook } from "@/utils/lemonsqueezy/server";
import AdminDashboardClient from "./client";

export default async function AdminDashboard() {
  const product_id = process.env.PRODUCT_ID;
  const webhook = await hasWebhook();
  const webhookUrl = webhook?.attributes.url;
  const hasWh = Boolean(webhook);

  if (!product_id) {
    throw new Error("No product ID found");
  }

  console.log("hasWh", hasWh);

  const productVariants = await getProductVariants(product_id);

  return (
    <AdminDashboardClient
      productVariants={productVariants}
      hasWebhook={hasWh}
      webhookUrl={webhookUrl || ''} // Providing a default empty string if webhookUrl is undefined
    /> 
  );
}
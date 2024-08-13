import { getProductVariants } from "@/utils/lemonsqueezy/server";
import AdminDashboardClient from "./client";

export default async function AdminDashboard() {
  const product_id = process.env.PRODUCT_ID;

  if (!product_id) {
    throw new Error("No product ID found");
  }

  const productVariants = await getProductVariants(product_id);

  return (
    <AdminDashboardClient
      productVariants={productVariants}
    />
  );
}
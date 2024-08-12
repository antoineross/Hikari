import { getProductVariants } from "../variants";
import PricingDialog from "./pricing-page";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Pricing() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  console.log(user);

  const store_id = process.env.LEMONSQUEEZY_STORE_ID;
  let product_id = process.env.PRODUCT_ID;

  if (!product_id) {
    throw new Error("No product ID found");
  }

  const productVariants = await getProductVariants(product_id);

  return (
    <>
      <PricingDialog
        productVariants={productVariants}
        user={user}
        store_id={store_id}
      />
    </>
  );
}
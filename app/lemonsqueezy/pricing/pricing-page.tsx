"use client";
 
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link";
import parse from 'html-react-parser';


export default function PricingContent({
  productVariants,
  user,
  store_id,
}: {
  productVariants: any;
  user: any;
  store_id: any;
}) {
  function createCheckoutLink({ variantId }: { variantId: string }): string {
    const baseUrl = new URL(
      `https://${store_id}.lemonsqueezy.com/checkout/buy/${variantId}`
    );

    const email = user?.user?.email;

    const url = new URL(baseUrl);
    // url.searchParams.append("checkout[custom][company_id]", company_id);
    if (email) url.searchParams.append("checkout[email]", email);

    return url.toString();
  }
  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-800 h-10 px-4 py-2 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
        Add subscription
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="mb-4">Select your plan</DialogTitle>
          <DialogDescription>
            <div className="flex gap-x-2 w-full">
              {productVariants.data.slice(1).map((variant: any) => (
                <div
                  key={variant.id}
                  className="border rounded-lg p-4 w-full justify-between"
                >
                  <h3 className="text-xl text-muted-foreground">
                    {variant.attributes.name}
                  </h3>
                  <p className="text-3xl font-bold text-pink-500 mb-6">
                    €{variant.attributes.price / 100}
                  </p>
                  <p className="prose dark:prose-invert prose-p:text-foreground prose-p:pb-2 prose-li:-my-6 prose-li:leading-5 prose-ul:h-40">
                    {parse(variant.attributes.description)}
                  </p>
                  <Link
                    className="w-full flex justify-center"
                    href={createCheckoutLink({
                      variantId: variant.attributes.slug,
                    })}
                  >
                    <Button className="mt-2 bg-pink-500 text-white dark:bg-pink-500 dark:text-white w-full hover:bg-pink-400 hover:dark:bg-pink-400">
                      Buy Now
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { syncPlans } from "@/utils/lemonsqueezy/server";

interface Variant {
  id: string;
  attributes: {
    name: string;
    price: number;
    description: string;
    slug: string;
  };
}

interface Props {
  productVariants: { data: Variant[] };
}

export default function AdminDashboardClient({ productVariants }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSyncVariants = async () => {
    setIsLoading(true);
    try {
      await syncPlans();
      toast({
        title: "Success",
        description: "Plans synced successfully",
      });
    } catch (error) {
      console.error('Error syncing plans:', error);
      toast({
        title: "Error",
        description: "Failed to sync plans",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
      <Button onClick={handleSyncVariants} disabled={isLoading}>
        {isLoading ? "Syncing..." : "Sync Plans with Database"}
      </Button>
      {productVariants.data.length === 0 ? (
        <p className="mt-5">No variants found. Please check your product ID or try syncing the plans.</p>
      ) : (
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Slug</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productVariants.data.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>{variant.attributes.name}</TableCell>
                <TableCell>${variant.attributes.price / 100}</TableCell>
                <TableCell>{variant.attributes.description.substring(0, 50)}...</TableCell>
                <TableCell>{variant.attributes.slug}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { syncPlans } from "@/utils/lemonsqueezy/server";
import { SetupWebhookButton } from "@/components/dashboard/setup-webhook-button";
import { Package, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
  hasWebhook: boolean;
  webhookUrl: string;
}

export default function AdminDashboardClient({ productVariants, hasWebhook, webhookUrl }: Props) {
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
      
      {/* Webhook Setup Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Webhook Setup
          </CardTitle>
          <CardDescription>
            Configure webhooks to listen for changes made on Lemon Squeezy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasWebhook ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Webhook is set up successfully</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <XCircle className="h-5 w-5" />
              <span>Webhook is not set up</span>
            </div>
          )}
          
          {hasWebhook ? (
            <div className="mt-4">
              <p className="font-semibold">Current Webhook URL:</p>
              <code className="bg-gray-100 p-2 rounded block mt-2">{webhookUrl}</code>
            </div>
          ) : (
            <>
              <p className="mb-4">
                Make sure you have entered all the required environment variables (.env).
                Configure the webhook on{" "}
                <a
                  href="https://app.lemonsqueezy.com/settings/webhooks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Lemon Squeezy
                </a>
                , or click the button below to set it up automatically.
              </p>
              <SetupWebhookButton disabled={hasWebhook} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Plans Sync and Display Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Product Plans</span>
            <Button 
              onClick={handleSyncVariants} 
              disabled={isLoading} 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Syncing..." : "Sync Plans"}
            </Button>
          </CardTitle>
          <CardDescription>
            Manage and view your product plans synced from Lemon Squeezy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productVariants.data.length === 0 ? (
            <p className="text-center text-gray-500 my-4">No variants found. Please check your product ID or try syncing the plans.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Slug</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productVariants.data.slice(1).map((variant: Variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">{variant.attributes.name}</TableCell>
                    <TableCell>${(variant.attributes.price / 100).toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate">{variant.attributes.description}</TableCell>
                    <TableCell>{variant.attributes.slug}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
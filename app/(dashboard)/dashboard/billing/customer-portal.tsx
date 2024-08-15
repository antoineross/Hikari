'use client';

import { Button } from "@/components/ui/button"

interface ManageSubscriptionButtonProps {
  customerPortalURL: string;
}

export function ManageSubscriptionButton({ customerPortalURL }: ManageSubscriptionButtonProps) {
  return (
    <Button 
      className="bg-[#D53F8C] text-white" 
      onClick={() => window.open(customerPortalURL, '_blank', 'noopener,noreferrer')}
    >
      Manage Subscription
    </Button>
  );
}
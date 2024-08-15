import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Label } from '@/components/ui/label'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

import { createClient } from '@/utils/supabase/server'
import { getUser, getSubscription } from '@/utils/supabase/queries'
import { getSignedCustomerPortalURL } from '@/utils/lemonsqueezy/server'
import { redirect } from 'next/navigation'
import { ManageSubscriptionButton } from './customer-portal'

export default async function Component() {
  const supabase = createClient()
  const [user, subscription] = await Promise.all([
    getUser(supabase),
    getSubscription(supabase)
  ])

  if (!user) {
    return redirect('/signin')
  }
  const isSubscribed = subscription && subscription.status === 'active'

  let customerPortalURL = null
  if (isSubscribed && subscription.lemon_squeezy_id) {
    customerPortalURL = await getSignedCustomerPortalURL(subscription.lemon_squeezy_id)
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Billing</h1>
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Current Plan</h2>
          <Card className="mt-4">
            <CardContent className="p-4">
              {isSubscribed ? (
                <>
                  <h3 className="text-lg font-bold">{subscription.plan.name}</h3>
                  <p className="mt-1">{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                  }).format(parseInt(subscription.price) / 100)} per month</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your plan renews on {new Date(subscription.renews_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                  </p>
                  <div className="mt-4 flex space-x-2">
                    {customerPortalURL && (
                      <ManageSubscriptionButton customerPortalURL={customerPortalURL} />
                    )}
                    <Button variant="outline">Cancel plan</Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold">No Active Plan</h3>
                  <p className="mt-1">You're currently not subscribed to any plan.</p>
                  <div className="mt-4">
                    <Button className="bg-[#D53F8C] text-white">Upgrade plan</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
        {/* Rest of your component remains unchanged */}
      </main>
    </div>
  )
}
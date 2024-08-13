import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Label } from '@/components/ui/label'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

import { createClient } from '@/utils/supabase/server'
import { getUser, getSubscription } from '@/utils/supabase/queries'
import { redirect } from 'next/navigation'

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

  return (
    <div className="flex min-h-screen">
      {/* <aside className="w-1/4 bg-[#4A5568] p-8 text-white">
      <div className="space-y-8">
          <div>
            <h1 className="text-xl font-bold">Typographic</h1>
            <p className="mt-2">Hand-picked webfonts for your next project.</p>
          </div>
          <div>
            <a href="#" className="flex items-center text-sm">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Return to Typographic
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 flex space-x-4 text-sm">
          <span>Powered by</span>
          <span className="font-bold">Typographic</span>
          <a href="#" className="text-muted-foreground">
            Terms
          </a>
          <a href="#" className="text-muted-foreground">
            Privacy
          </a>
        </div>
      </aside> */}
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
                    <Button className="bg-[#D53F8C] text-white">Change plan</Button>
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
          {/* Payment Method Section */}
          <section className="mt-8">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Default</Badge>
                  <span>•••• 4242</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Expires 02/2024</span>
                  <Button variant="outline">Edit</Button>
                </div>
              </div>
              <a href="#" className="mt-4 block text-sm text-muted-foreground">
                + Add payment method
              </a>
            </CardContent>
          </Card>
        </section>

        {/* Billing History Section */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Billing History</h2>
          <Card className="mt-4">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Sample data, replace with actual data */}
                  <TableRow>
                    <TableCell>May 1, 2023</TableCell>
                    <TableCell>$10.00</TableCell>
                    <TableCell>Typographic Starter</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Apr 1, 2023</TableCell>
                    <TableCell>$10.00</TableCell>
                    <TableCell>Typographic Starter</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mar 1, 2023</TableCell>
                    <TableCell>$10.00</TableCell>
                    <TableCell>Typographic Starter</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
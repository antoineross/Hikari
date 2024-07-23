"use client"
import { Eclipse, Github } from "lucide-react";
import Particles from "@/components/magicui/particles";
import Link from "next/link";
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-foreground">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-lg border bg-background p-8 md:shadow-xl mt-4">
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={"#000000"}
          refresh
        />
        <div className="z-10 relative">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Eclipse className="h-7 w-7" />
            <span className="text-3xl font-bold bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Hikari</span>
          </div>
          <article className="prose prose-lg mx-auto my-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Privacy Policy: Our Commitment to the Community</h1>
            <p className="mb-4 text-muted-foreground">
              Hikari is an open-source project dedicated to empowering developers to build applications using Next.js, Supabase, and Stripe. As a community-driven initiative, we value transparency and respect for our users&apos; privacy.
            </p>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Email Collection</h2>
            <p className="mb-4 text-muted-foreground">We collect email addresses when you:</p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li className="mb-2 pl-2">Subscribe to our project updates</li>
              <li className="mb-2 pl-2">Contribute to the project</li>
              <li className="mb-2 pl-2">Reach out to us for support or inquiries</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Use of Email Addresses</h2>
            <p className="mb-4 text-muted-foreground">Your email address is used solely for the following purposes:</p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li className="mb-2 pl-2">To send project updates and announcements</li>
              <li className="mb-2 pl-2">To communicate about contributions and issues</li>
              <li className="mb-2 pl-2">To respond to support requests</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Open Source Commitment</h2>
            <p className="mb-4 text-muted-foreground">
              As an open-source project, we are committed to transparency. We do not sell or monetize your personal information in any way. Our project&apos;s source code is publicly available, ensuring that our practices are open to scrutiny by the community.
            </p>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Data Storage</h2>
            <p className="mb-4 text-muted-foreground">
              We use Supabase, an open-source Firebase alternative, for data storage. Your email and any associated data are stored securely within Supabase&apos;s infrastructure. We encourage you to review Supabase&apos;s privacy policy for more information on their data handling practices.
            </p>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Community Contributions</h2>
            <p className="mb-4 text-muted-foreground">
              If you contribute to the Hikari project, your contributions will be publicly visible in our GitHub repository. This includes your GitHub username and any information you choose to include in your commits or pull requests.
            </p>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Your Rights</h2>
            <p className="mb-4 text-muted-foreground">As a member of our community, you have the right to:</p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li className="mb-2 pl-2">Unsubscribe from our communications at any time</li>
              <li className="mb-2 pl-2">Request access to the data we hold about you</li>
              <li className="mb-2 pl-2">Request the correction or deletion of your data</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Changes to This Policy</h2>
            <p className="mb-4 text-muted-foreground">
              As our project evolves, we may update this Privacy Policy. Any changes will be communicated through our GitHub repository and project communication channels.
            </p>
            <p className="mb-4 text-muted-foreground">
              Thank you for being part of the Hikari community. We&apos;re committed to maintaining the trust you place in our project.
            </p>
            <Separator className="my-4"/>
            <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-muted-foreground">Built with ❤️ by Antoine</p>
            <div className="flex space-x-4">
              <a href="https://github.com/antoineross/hikari" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://x.com/antoineross__" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                </svg>
              </a>
            </div>
          </div>
          </article>
          <div className="text-center mt-8">
            <Link href="/" className="text-sm text-muted-foreground underline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
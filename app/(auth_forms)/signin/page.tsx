'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  signInWithEmail,
  signInWithPassword
} from '@/utils/auth-helpers/server';
import { signInWithOAuth } from '@/utils/auth-helpers/client';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Github, Chrome } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  const oAuthProviders = [
    {
      name: 'github',
      displayName: 'GitHub',
      icon: <Github className="mr-2 h-4 w-4" />
    },
    {
      name: 'google',
      displayName: 'Google',
      icon: <Chrome className="mr-2 h-4 w-4" />
    }
  ];
  const handleOAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth(e);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="rounded-md p-2 transition-colors hover:bg-muted"
          prefetch={false}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Link>
        <div />
      </div>
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardContent className="grid gap-4 px-4 pb-4 my-10">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold">Sign In</h2>
              <p className="text-muted-foreground my-2">
                Enter your email below to sign in to your account
              </p>
            </div>
            <form
              noValidate={true}
              className="grid gap-4"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Sign in
              </Button>
            </form>
            <div className="flex justify-center">
              <Link
                href="/signup"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
              >
                Don't have an account? Sign up
              </Link>
            </div>
            <div className="flex justify-center">
              <Link
                href="/forgot_password"
                className="text-sm font-bold hover:underline underline-offset-4"
                prefetch={false}
              >
                Forgot your password?
              </Link>
            </div>
            <Separator className="my-6" />
            <div className="grid gap-2">
              {oAuthProviders.map((provider) => (
                <form
                  key={provider.name}
                  className="pb-2"
                  onSubmit={(e) => handleOAuthSubmit(e)}
                >
                  <input type="hidden" name="provider" value={provider.name} />
                  <Button
                    variant="outline"
                    type="submit"
                    className="w-full"
                    loading={isSubmitting}
                    disabled={provider.name === 'google'} // Disable button if provider is Google
                  >
                    {provider.icon}
                    Sign in with {provider.displayName}
                  </Button>
                </form>
              ))}
            </div>
            <p className="text-muted-foreground text-xs text-center my-2">
              For testing purposes, only Github is available.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ChromeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

function GithubIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

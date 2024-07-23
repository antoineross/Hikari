'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Particles from "@/components/magicui/particles";
import { Eclipse, Github } from "lucide-react";
import { CoolMode } from "@/components/magicui/cool-mode";
import { Separator } from "@/components/ui/separator"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/components/ui/use-toast"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Home() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('user_email_list')
        .insert([{ email }])
      
      if (error) throw error

      toast({
        title: "Subscribed! 🎉",
        description: "Thank you for subscribing! You will get an email when the app comes out.",
      })
      setEmail('')
    } catch (error) {
      console.error('Error inserting email:', error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-foreground">
      <div className="relative flex h-[600px] w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={"#000000"}
          refresh
        />
        <div className="z-10 space-y-8 p-8">
          <div className="flex items-center justify-center space-x-2">
            <Eclipse className="h-7 w-7" />
            <span className="text-3xl font-bold bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10">Hikari</span>
          </div>
          <span className="pointer-events-none h-[80px] text-center whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 flex justify-center items-center mt-2">
            Coming Soon
          </span>
          <div className="space-y-3 text-center">
            <p className="text-lg text-muted-foreground">Sign up to be the first to know when we launch.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full text-lg relative z-20" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CoolMode>
            <Button type="submit" className="w-full text-lg relative z-20 bg-gradient-to-b from-black to-gray-300/80 hover:from-gray-800 hover:to-gray-400/80 dark:from-white dark:to-slate-900/10 dark:hover:from-slate-200 dark:hover:to-slate-800/10">
              <span className="bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-white dark:from-white dark:to-slate-900/10">
                Subscribe
              </span>
            </Button>
            </CoolMode>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            We&apos;ll never share your email. Read our{" "}
            <Link href="/privacy-policy" className="underline relative z-20" prefetch={false}>
              privacy policy
            </Link>
            .
          </p>
          <Separator className="mt-4"/>
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-muted-foreground">Built with ❤️ by <a href="https://x.com/antoineross__" target="_blank" rel="noopener noreferrer" className="underline">Antoine</a></p>
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
        </div>
      </div>
    </div>
  )
}
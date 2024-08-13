import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
        // getAll() {
        //   return request.cookies.getAll()
        // },
        // setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        //   cookiesToSet.forEach(({ name, value, options }) => {
        //     request.cookies.set({ name, value, ...options })
        //     response.cookies.set({ name, value, ...options })
        //   })
        // },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, redirect the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // If you need to create a new response or modify the existing one:
  // const newResponse = NextResponse.next({ request: { headers: request.headers } })
  // Copy over the cookies to the new response
  // response.cookies.getAll().forEach(cookie => {
  //   newResponse.cookies.set(cookie)
  // })
  // return newResponse

  return response
}
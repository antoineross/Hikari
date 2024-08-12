import { createServerSupabaseClient } from "@/app/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function auth() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signOut() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
}
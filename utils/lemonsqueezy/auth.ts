import { createServerSupabaseClient } from "@/app/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function auth() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

export async function signOut() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
}
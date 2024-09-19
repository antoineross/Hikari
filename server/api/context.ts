import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getUser } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export async function createContext({ req, res }: CreateNextContextOptions) {
  const supabase = createClient();
  const user = await getUser(supabase);

  return {
    user,
    supabase,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
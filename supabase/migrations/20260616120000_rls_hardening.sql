-- RLS hardening for the Hikari schema (Supabase-recommended; surfaced with pgrls).

-- 1. Evaluate auth.uid() once per statement instead of once per row.
--    https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv
alter policy "Can view own user data."      on public.users         using ((select auth.uid()) = id);
alter policy "Can update own user data."    on public.users         using ((select auth.uid()) = id);
alter policy "Can only view own subs data." on public.subscriptions using ((select auth.uid()) = user_id);
alter policy "Can view own posts"           on public.posts         using ((select auth.uid()) = user_id);
alter policy "Can update own posts"         on public.posts         using ((select auth.uid()) = user_id);
alter policy "Can delete own posts"         on public.posts         using ((select auth.uid()) = user_id);
-- The INSERT policy already subquery-wraps its row-count check; wrap the inner
-- auth.uid() too for consistency (per review feedback).
alter policy "Can insert own posts"         on public.posts
  with check ((select count(*) from public.posts where user_id = (select auth.uid())) < 5);

-- 2. Index the columns the RLS policies filter on (else each check seq-scans).
create index if not exists posts_user_id_idx         on public.posts (user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

-- 3. Pin search_path on the SECURITY DEFINER trigger function.
alter function public.handle_new_user() set search_path = public, pg_temp;

-- 4. Defense-in-depth: subject owner-role sessions to RLS too.
alter table public.users         force row level security;
alter table public.customers     force row level security;
alter table public.products      force row level security;
alter table public.prices        force row level security;
alter table public.subscriptions force row level security;
alter table public.posts         force row level security;

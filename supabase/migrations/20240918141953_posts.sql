-- Create the posts table
create table posts (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  title text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable row level security on the posts table
alter table posts enable row level security;

-- Create RLS policy to allow users to view their own posts
create policy "Can view own posts" on posts
  for select
  using (auth.uid() = user_id);

-- Create RLS policy to allow users to insert posts, with a check to limit to 5 posts per user
create policy "Can insert own posts" on posts
  for insert
  with check (
    (select count(*) from posts where user_id = auth.uid()) < 5
  );

-- Create RLS policy to allow users to update their own posts
create policy "Can update own posts" on posts
  for update
  using (auth.uid() = user_id);

-- Create RLS policy to allow users to delete their own posts
create policy "Can delete own posts" on posts
  for delete
  using (auth.uid() = user_id);
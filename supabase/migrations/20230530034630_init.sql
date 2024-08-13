-- Create the users table
CREATE TABLE users (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'))
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing own user data
CREATE POLICY "Can view own user data." 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Create policy for updating own user data except role
CREATE POLICY "Can update own user data except role." 
  ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add is_admin function
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    SELECT (role = 'admin') INTO is_admin
    FROM users
    WHERE id = user_id;
    RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy for admins to update any user data including role
CREATE POLICY "Admins can update any user data." 
  ON users
  FOR UPDATE
  USING (is_admin(auth.uid()));

-- Create policy for admins to view all user data
CREATE POLICY "Admins can view all user data." 
  ON users FOR SELECT 
  USING (is_admin(auth.uid()));

-- Existing trigger for new user creation
CREATE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Lemon Squeezy plan table (replacing products and prices)
CREATE TABLE IF NOT EXISTS "plan" (
  "id" serial PRIMARY KEY NOT NULL,
  "product_id" integer NOT NULL,
  "product_name" text,
  "variant_id" integer NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "price" text NOT NULL,
  "is_usage_based" boolean DEFAULT false,
  "interval" text,
  "interval_count" integer,
  "trial_interval" text,
  "trial_interval_count" integer,
  "sort" integer,
  CONSTRAINT "plan_variant_id_unique" UNIQUE("variant_id")
);
ALTER TABLE plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access." ON plan FOR SELECT USING (true);

-- Admin policies for plan table
CREATE POLICY "Admins can perform all actions on plans." 
ON plan
FOR ALL
USING (is_admin(auth.uid()));

-- Updated subscriptions table (referencing plan instead of price)
CREATE TABLE subscriptions (
  id serial PRIMARY KEY,
  lemon_squeezy_id text UNIQUE NOT NULL,
  order_id integer NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL,
  status_formatted text NOT NULL,
  renews_at timestamp with time zone,
  ends_at timestamp with time zone,
  trial_ends_at timestamp with time zone,
  price text NOT NULL,
  is_usage_based boolean DEFAULT false,
  is_paused boolean DEFAULT false,
  subscription_item_id serial,
  user_id uuid references auth.users not null,
  plan_id integer NOT NULL REFERENCES plan(id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can only view own subs data." ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Allow admins to update subscriptions
CREATE POLICY "Admins can update any subscription." 
  ON subscriptions
  FOR UPDATE
  USING (is_admin(auth.uid()));

-- Allow admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions." 
  ON subscriptions FOR SELECT 
  USING (is_admin(auth.uid()));

-- Existing webhook_events table
CREATE TABLE webhook_events (
  id serial primary key,
  payment_provider text not null,
  event_type text not null,
  event_id text not null,
  api_version text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  data jsonb not null,
  processed boolean not null default false,
  processing_error text
);
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Update realtime subscriptions
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE plan;


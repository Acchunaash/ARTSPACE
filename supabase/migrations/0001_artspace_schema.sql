-- ARTSPACE production data model (Supabase / PostgreSQL)
-- Apply through the Supabase SQL editor or migration tooling.
-- Never expose the Supabase service-role key in browser code.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  price_inr integer not null check (price_inr >= 0),
  image_url text,
  category text,
  active boolean not null default true,
  inventory_count integer check (inventory_count is null or inventory_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  currency text not null default 'INR' check (currency = 'INR'),
  subtotal_inr integer not null check (subtotal_inr >= 0),
  shipping_inr integer not null default 0 check (shipping_inr >= 0),
  total_inr integer not null check (total_inr = subtotal_inr + shipping_inr),
  shipping_address jsonb not null,
  payment_provider text,
  payment_reference text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  title_snapshot text not null,
  unit_price_inr integer not null check (unit_price_inr >= 0),
  size text not null check (size in ('A3','A2','A1')),
  finish text not null check (finish in ('Unframed','Black frame','Oak frame')),
  quantity integer not null check (quantity between 1 and 10),
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

create index if not exists products_active_category_idx on public.products(active, category);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);

alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admins enable row level security;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
  on public.products for select
  using (active = true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
  on public.products for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid() and a.role in ('admin','editor')))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid() and a.role in ('admin','editor')));

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Customers can view own orders" on public.orders;
create policy "Customers can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid() and a.role in ('admin','editor')));

drop policy if exists "Customers can view own order items" on public.order_items;
create policy "Customers can view own order items"
  on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items"
  on public.order_items for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid() and a.role in ('admin','editor')))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid() and a.role in ('admin','editor')));

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
  on public.orders for update
  using (exists (select 1 from public.admins a where a.user_id = auth.uid() and a.role in ('admin','editor')))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid() and a.role in ('admin','editor')));

drop policy if exists "Users can view own admin record" on public.admins;
create policy "Users can view own admin record"
  on public.admins for select
  using (auth.uid() = user_id);

-- Intentionally no public/client INSERT policy for orders or payment state.
-- Create orders and verify payment signatures only in trusted server-side code.

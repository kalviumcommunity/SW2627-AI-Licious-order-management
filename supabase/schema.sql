-- Run this file in the Supabase SQL editor before using the dashboard.
create extension if not exists "uuid-ossp";

create table if not exists public.inventory_items (
  id uuid primary key default uuid_generate_v4(), name text not null, category text not null,
  sku text not null unique, price numeric(12,2) not null check (price >= 0), quantity integer not null default 0 check (quantity >= 0),
  unit text not null default 'kg', image_url text, status text not null default 'Active' check (status in ('Active', 'Pending', 'Inactive')), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(), customer_name text not null, customer_phone text not null,
  status text not null default 'New' check (status in ('New','Preparing','Ready','Delivered','Cancelled')),
  total_amount numeric(12,2) not null check (total_amount >= 0), payment_method text, payment_status text default 'Pending',
  delivery_address text, delivery_instructions text, delivery_partner jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(), order_id uuid not null references public.orders(id) on delete cascade,
  inventory_item_id uuid references public.inventory_items(id) on delete set null, product_name text not null, quantity integer not null check (quantity > 0), unit_price numeric(12,2) not null check (unit_price >= 0), image_url text
);
create table if not exists public.offers (
  id uuid primary key default uuid_generate_v4(), title text not null, code text unique, type text not null check (type in ('Percentage','Flat','Delivery')),
  discount_value numeric(12,2) not null default 0, max_discount numeric(12,2), min_order_value numeric(12,2) default 0,
  start_date date not null, end_date date not null, usage_limit integer, usage_count integer not null default 0,
  applicable_categories text[] not null default '{}', applicable_products uuid[] not null default '{}', apply_to_all_products boolean not null default true,
  disabled boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (end_date >= start_date)
);
create table if not exists public.app_settings (id integer primary key check (id = 1), data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(), name text not null, email text not null unique,
  role text not null default 'Manager' check (role in ('Super Admin', 'Manager', 'Cashier')),
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.inventory_items add column if not exists status text not null default 'Active' check (status in ('Active', 'Pending', 'Inactive'));
insert into public.app_settings (id, data) values (1, '{}') on conflict (id) do nothing;
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists inventory_category_idx on public.inventory_items(category);
create index if not exists offers_dates_idx on public.offers(start_date, end_date);
alter table public.inventory_items enable row level security; alter table public.orders enable row level security; alter table public.order_items enable row level security; alter table public.offers enable row level security; alter table public.app_settings enable row level security; alter table public.admin_users enable row level security;
create policy "authenticated inventory access" on public.inventory_items for all to authenticated using (true) with check (true);
create policy "authenticated orders access" on public.orders for all to authenticated using (true) with check (true);
create policy "authenticated order items access" on public.order_items for all to authenticated using (true) with check (true);
create policy "authenticated offers access" on public.offers for all to authenticated using (true) with check (true);
create policy "authenticated settings access" on public.app_settings for all to authenticated using (true) with check (true);
create policy "authenticated admin users access" on public.admin_users for all to authenticated using (true) with check (true);

-- Enable the database tables for Supabase Realtime as well as the Socket.IO relay.
do $$ begin
  alter publication supabase_realtime add table public.inventory_items, public.orders, public.order_items, public.offers, public.app_settings, public.admin_users;
exception when duplicate_object then null;
end $$;

-- Optional starter records; remove this block if production data already exists.
insert into public.inventory_items (name, category, sku, price, quantity, unit) values
  ('Chicken Curry Cut', 'Chicken', 'CHK-CC-001', 450, 120, 'kg'),
  ('Rawas Fillet', 'Fish & Seafood', 'FSH-RF-001', 650, 20, 'kg')
on conflict (sku) do nothing;

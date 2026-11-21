# ARTSPACE backend foundation

The migration in `migrations/0001_artspace_schema.sql` defines the initial PostgreSQL data model for a Supabase project:

- Public active catalog records
- Customer profiles linked to Supabase Auth
- Orders and immutable order-item snapshots
- Admin/editor roles
- Row Level Security policies and supporting indexes

## Setup

1. Create a Supabase project.
2. Open its SQL Editor and apply `migrations/0001_artspace_schema.sql`.
3. Apply `seed.sql` to create the six initial product records.
4. Enable the authentication providers you intend to support.
5. Create the first trusted admin account through Supabase Auth.
6. Add that account to `public.admins` from the SQL Editor using its Auth user UUID. Never let a public signup request grant itself an admin role.
7. Upload final artwork files to Supabase Storage and fill each product `image_url` with its hosted URL.
8. Build a server-side API for checkout and order creation.

## Payment security requirements

The browser must never create a paid order or set an order to `paid`. A trusted server endpoint must:

- Recalculate every price from the database; never trust client totals.
- Create a pending order.
- Create a payment order with the provider using server-only credentials.
- Verify the provider's signed callback/webhook on the server.
- Atomically record the verified payment and update inventory/order status.
- Make webhook handling idempotent.

Do not commit Supabase service-role keys, payment secrets, webhook secrets, or customer credentials. GitHub Pages is a static host and cannot run these trusted server-side operations by itself.

# LMU Booking System — Setup Guide

Follow these steps in order after creating your Supabase project.

---

## Step 1: Create Your Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com) and create a new project.
2. Note your **Project URL** and **Anon Key** (Settings → API).

---

## Step 2: Run the Database Migrations

In the Supabase SQL Editor, run these files **in order**:

1. `supabase/migrations/001_schema.sql` — creates all tables + RLS policies
2. `supabase/seed.sql` — seeds partner hotels + social fire locations
3. `supabase/seed_beach_access.sql` — seeds beach access locations with approximate coordinates

---

## Step 3: Geocode Beach Access Locations

The beach access seed data has approximate coordinates. Run the geocoding script to get precise values:

```bash
npm install @supabase/supabase-js node-fetch
SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/geocode-locations.js > /tmp/geo-updates.sql
```

Then paste the contents of `/tmp/geo-updates.sql` into the Supabase SQL Editor and run it.

---

## Step 4: Configure Your Keys

1. Copy `.env.example` to `.env` and fill in your values.
2. In **`lib/lmu-backend.js`**, find the `CONFIG` section near the top and replace:
   - `YOUR_SUPABASE_URL` → your Supabase project URL
   - `YOUR_SUPABASE_ANON_KEY` → your Supabase anon key

---

## Step 5: Deploy the Edge Function

The edge function handles email confirmations and HubSpot sync.

```bash
# Install Supabase CLI if you haven't: https://supabase.com/docs/guides/cli
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy booking-webhook
```

Set the function secrets in Supabase Dashboard → Functions → Secrets:
- `HUBSPOT_API_KEY`
- `EMAIL_SERVICE_API_KEY`
- `EMAIL_PROVIDER` (e.g. `resend`)
- `EMAIL_FROM`
- `INTERNAL_NOTIFY_EMAIL`

---

## Step 6: Activate Partner Hotels

Once you have real hotel data, update the `partner_hotels` table:
- Set real `name`, `address`, `latitude`, `longitude`, `slug`
- Set `active = true` and `offers_social_fire = true`
- The social fires page will automatically show active hotels

---

## QR Code URLs for Hotels

QR codes at partner hotels should point to:
```
https://www.lightmeupbonfires.com/social-fire-[hotel-slug].html?source=qr_code
```

Hotel website links use:
```
https://www.lightmeupbonfires.com/social-fire-[hotel-slug].html?source=hotel_website
```

The `source` parameter is stored in `social_fire_bookings.source` for tracking.

---

## Payment (Phase 2)

Search for `// PAYMENT_PHASE_2` in the codebase to find all locations where
Stripe payment integration will plug in. No payment code exists yet.

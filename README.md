# NearTask

Local task marketplace for Afghanistan. Post a job nearby, get offers, pick a helper, chat, and **pay in cash** when the work is done.

## Stack

Next.js App Router, TypeScript, Tailwind, shadcn/ui, TanStack Query, Supabase (Auth, Postgres, Storage, Realtime).

## Setup

1. Copy `.env.example` to `.env.local` and fill in the Supabase URL and anon key.
2. Optional: `NEXT_PUBLIC_MAPBOX_TOKEN` enables Mapbox reverse geocoding. Without it, location falls back to the nearest Afghan city.
3. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

Password for all seed users: `NearTask!2026`

- `ahmad@neartask.local` — requester in Shar-e-Naw, Kabul
- `fatima@neartask.local` — helper
- `omar@neartask.local` — helper (plumber)

If you are not in Afghanistan, Home will ask for location. Use **Preview Kabul** to see seed tasks.

## Product loop

Post → nearby discover → offer → select helper → chat → complete → review. No in-app payments.

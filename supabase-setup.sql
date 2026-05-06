-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

CREATE TABLE trip_data (
  id INTEGER PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with empty structure (admin panel will populate the real data)
INSERT INTO trip_data (id, data) VALUES (1, '{
  "trip": {},
  "itinerary": [],
  "attractions": [],
  "reservations": [],
  "packing": []
}'::jsonb);

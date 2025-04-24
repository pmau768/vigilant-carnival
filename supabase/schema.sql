-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create auth schema for supabase user tables
CREATE SCHEMA IF NOT EXISTS auth;

-- Create tables
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  breed TEXT,
  age INTEGER,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  distance FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hike_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hike_id UUID NOT NULL REFERENCES hikes(id) ON DELETE CASCADE,
  location GEOMETRY(POINT, 4326) NOT NULL,
  elevation FLOAT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hike_locations ENABLE ROW LEVEL SECURITY;

-- Create policies: users can only see and modify their own data
CREATE POLICY "Users can view their own pets"
  ON pets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
  ON pets FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for hikes and locations
CREATE POLICY "Users can view their own hikes"
  ON hikes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hikes"
  ON hikes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hikes"
  ON hikes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view locations for their hikes"
  ON hike_locations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM hikes
    WHERE hikes.id = hike_locations.hike_id
    AND hikes.user_id = auth.uid()
  ));

CREATE POLICY "Users can add locations to their hikes"
  ON hike_locations FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM hikes
    WHERE hikes.id = hike_locations.hike_id
    AND hikes.user_id = auth.uid()
  )); 
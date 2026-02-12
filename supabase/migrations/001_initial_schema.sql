-- Create farmers table
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  farm_size NUMERIC NOT NULL
);

-- Create crops table
CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  planted_date DATE NOT NULL,
  expected_harvest DATE NOT NULL,
  quantity NUMERIC NOT NULL,
  status TEXT DEFAULT 'planted'
);

-- Create market_prices table
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  location TEXT NOT NULL
);

-- Create indexes
CREATE INDEX idx_crops_farmer_id ON crops(farmer_id);
CREATE INDEX idx_market_prices_crop_type ON market_prices(crop_type);
CREATE INDEX idx_market_prices_date ON market_prices(date);

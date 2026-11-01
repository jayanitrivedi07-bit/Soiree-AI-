-- =============================================================================
-- Soirée AI: Supabase PostgreSQL Database Schema
-- Version: 1.0.0
-- Currency: INR (₹)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Events Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    guest_count INTEGER NOT NULL CHECK (guest_count > 0),
    total_budget NUMERIC(14, 2) NOT NULL CHECK (total_budget >= 0),
    currency VARCHAR(10) DEFAULT 'INR',
    theme VARCHAR(255) NOT NULL,
    food_preferences TEXT,
    dietary_preferences TEXT,
    additional_requirements TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- -----------------------------------------------------------------------------
-- 2. Expenses Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    estimated_amount NUMERIC(14, 2) NOT NULL CHECK (estimated_amount >= 0),
    actual_amount NUMERIC(14, 2) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('paid', 'contracted', 'pending', 'reserved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- -----------------------------------------------------------------------------
-- 3. Tasks Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    deadline DATE NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    is_done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_event_id ON tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_is_done ON tasks(is_done);

-- -----------------------------------------------------------------------------
-- 4. Vendors Catalog Table (with Demo Flag)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    price_range NUMERIC(14, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 0,
    tagline VARCHAR(255),
    image_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    services JSONB DEFAULT '[]'::jsonb,
    lead_time VARCHAR(100),
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);

-- -----------------------------------------------------------------------------
-- 5. Event Vendors Mapping Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    quotation_amount NUMERIC(14, 2) NOT NULL,
    contact_status VARCHAR(50) DEFAULT 'inquiry',
    booking_status VARCHAR(50) DEFAULT 'shortlisted' CHECK (booking_status IN ('booked', 'contracted', 'inquiry', 'shortlisted')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_event_vendors_event ON event_vendors(event_id);

-- -----------------------------------------------------------------------------
-- 6. Chat Messages Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    message TEXT NOT NULL,
    suggestions TEXT[] DEFAULT '{}',
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_event ON chat_messages(event_id);

-- -----------------------------------------------------------------------------
-- 7. AI Planning Results Cache
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_planning_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL,
    structured_plan JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_planning_event ON ai_planning_results(event_id);

-- -----------------------------------------------------------------------------
-- Seed Initial Demo Vendors
-- -----------------------------------------------------------------------------
INSERT INTO vendors (id, name, category, description, location, contact_email, phone, price_range, rating, reviews_count, tagline, image_url, gallery_urls, is_demo)
VALUES 
(
    'v1',
    'Kiran Caterers & Atelier Banquet',
    'Catering',
    'Renowned for orchestrating royal Rajputana feasts with Michelin-grade contemporary culinary art.',
    'Udaipur & Mumbai',
    'kiran@kirancaterers.in',
    '+91 98765 43210',
    690000,
    4.9,
    38,
    'Master Sommelier & Haute Cuisine Specialist',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBGl6QCSUkb5ShvtE3ZZzogJp1_JuRh8cx32xC98C0lsDj_m7B6aew6o4UAJD7dL4KsStodI45FVJumkRg4PBaHjx_qwKjre6mxolrDwDV8ePtkkXKsDOdImw_kAmSyzeZGsu84OQxvReHJRsq7bf-kNkokj-9BuYvL40d_d3bhNgNrqJl2ERIQZWnWBPkCiowH2cfaEp_I3Vr31J_LOJ4nAMHyxphS61sm9ttpUasy',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuDy4UU-sxKduE7IjApp0a9jrpJhS4dqrTTAZM5VN1UzBVxHeiYvzZuRkStPdR3TpAOy2830WhRnopKr3VVA94hJztpWDW-dyiNmWvq1O4ynSC3fpMCPN97cZZtnlhK86rieRvuZtOX2JBVA9xlJaL9iBwbltcpy99S3U-jHY8icH0DQ8O_1X7Oj55cGDNS73q17-5ofp7qEPWqDmXMDoAtTdiDQDdvI0WHKV3dGvraN'],
    TRUE
),
(
    'v2',
    'Garden & Bloom Floral Studio',
    'Florals',
    'Bespoke botanical installations featuring English garden roses, Dutch hydrangeas, and traditional marigolds.',
    'Jaipur & Udaipur',
    'hello@gardenbloom.in',
    '+91 98765 12345',
    300000,
    4.8,
    24,
    'Sculptural Botanical Architecture & Candlelit Canopy',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDy4UU-sxKduE7IjApp0a9jrpJhS4dqrTTAZM5VN1UzBVxHeiYvzZuRkStPdR3TpAOy2830WhRnopKr3VVA94hJztpWDW-dyiNmWvq1O4ynSC3fpMCPN97cZZtnlhK86rieRvuZtOX2JBVA9xlJaL9iBwbltcpy99S3U-jHY8icH0DQ8O_1X7Oj55cGDNS73q17-5ofp7qEPWqDmXMDoAtTdiDQDdvI0WHKV3dGvraN',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuATsTxY-tA_IIfEhKA6irQ8aFM_dcyG3m26E1PTmzcQCqiZg2gThHc5SkOqld2-wPETDXpQm4FDb8yiNRRrb3LuWx7dPjA5YDPO93fpfGmwMJUfpZTLqHKpr-8Jnen9CJepm39ysLUEzfG2GQ2D9j3nXHlsKlDc1BQUOWuXWTRgnZu6CFDqKflrJBIfikjusZD6WwX_Y4g0M8LRbanHYWUoJV6wpa_2gSwK2RouVgB2'],
    TRUE
),
(
    'v3',
    'Prism Lens Co. Cinematography',
    'Photography',
    'Fine art wedding imagery captured in medium format film and 4K cinema cameras.',
    'Delhi & Udaipur',
    'shoots@prismlens.in',
    '+91 99001 23456',
    250000,
    5.0,
    42,
    'Vogue & Architectural Style Celebration Imagery',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuATsTxY-tA_IIfEhKA6irQ8aFM_dcyG3m26E1PTmzcQCqiZg2gThHc5SkOqld2-wPETDXpQm4FDb8yiNRRrb3LuWx7dPjA5YDPO93fpfGmwMJUfpZTLqHKpr-8Jnen9CJepm39ysLUEzfG2GQ2D9j3nXHlsKlDc1BQUOWuXWTRgnZu6CFDqKflrJBIfikjusZD6WwX_Y4g0M8LRbanHYWUoJV6wpa_2gSwK2RouVgB2',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuDzMILR1OfAldtluTRo7w0_MNx8rCEtMGmZFOdg93-3nreBNWYi_uaqZlwW2-RvHShgMKrXZbD02KBQmcb7CXhpPCkM4dTvYgSecg5L6wkLdhsCNuqEGfpkDN4_rt2yMzi7KvULlv5YNXr345WZD7bmqdcR1q3q-q6BQqFVgEf_6vYqImnRlG301FTwoMsJcFs4LMH9xLzBjcPyOGRHHWSJWlvjs4zAxro7a6XNKxzz'],
    TRUE
),
(
    'v4',
    'Raga & Strings Ensemble',
    'Entertainment',
    'Bridging timeless Indian ragas with contemporary orchestral compositions.',
    'Rajasthan',
    'bookings@ragastrings.in',
    '+91 97890 56789',
    150000,
    4.9,
    19,
    'Classical Sitar, Santoor & Acoustic String Quartet',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCg2DJOWmrgVidC4VwH36kIXW0LZfOPEbwoh443TlhiNoYD155WP1Ulgm2oRqGpTUtrfLLX1znjap02sHd0KUmu1k-Xm2BR4iJD_5Jdd-f4Pn6-3j1Bd-tywZ4ZshLKQTwiv7kqpW2iurxClOJrtOR1FWwggv-uyMyeCyaEvyhMQkY866L724B88IoyJINy_mImeeVz9aTsWyriW1g079lCNFYAsLITe8XUBEmIziGq',
    '{}',
    TRUE
),
(
    'v5',
    'Royal Drapery & Lighting Co.',
    'Decor',
    'Transforming ballrooms into intimate candlelit sanctuaries.',
    'Udaipur',
    'info@royaldrapery.in',
    '+91 96543 21000',
    200000,
    4.7,
    31,
    'Warm Ambient Illumination & Rich Velvet Canopies',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDzMILR1OfAldtluTRo7w0_MNx8rCEtMGmZFOdg93-3nreBNWYi_uaqZlwW2-RvHShgMKrXZbD02KBQmcb7CXhpPCkM4dTvYgSecg5L6wkLdhsCNuqEGfpkDN4_rt2yMzi7KvULlv5YNXr345WZD7bmqdcR1q3q-q6BQqFVgEf_6vYqImnRlG301FTwoMsJcFs4LMH9xLzBjcPyOGRHHWSJWlvjs4zAxro7a6XNKxzz',
    '{}',
    TRUE
),
(
    'v6',
    'The Leela Palace Heritage Grounds',
    'Venue',
    'An iconic palace hotel overlooking Lake Pichola and the City Palace.',
    'Lake Pichola, Udaipur',
    'events@theleela.com',
    '+91 294 670 1234',
    800000,
    5.0,
    88,
    'Palatial Lakeside Setting with Panoramic Lake Pichola Views',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCr5sZ_7GFrFL0RkCD5PzfUZP9s9jM3ilGf35lVWxC52DMJV3omvNgAGe3WsICvZz48uhVwuf33v56g7FELHAhDjmB5b83NC6ztvb3xzon1vOqLHUtX5lx5MYdH3rnTGpkAelnhNtajDNETGp9Yf-h7Dg50fLxf-KM7DKQAiZOaOBKgkexjX19tO6rQWCNBEHQOWy7wLpx8fS2I3ZLfkEXAdoTU3Qr3Keb0uEitx9xP',
    '{}',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

